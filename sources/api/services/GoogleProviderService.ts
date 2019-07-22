import { google, calendar_v3 } from 'googleapis';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { TimeSlot } from '../../utils/TimeSlot';

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.WEB_HOST}auth`,
});

const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email',
];

export function generateAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: scopes,
  });
}

export function getToken(code: string): Promise<GetTokenResponse> {
  return oauth2Client.getToken(code);
}

export async function getUserEmail(token: string) {
  oauth2Client.setCredentials({ access_token: token });

  const oauthApi = google.oauth2({ version: 'v2', auth: oauth2Client });

  const userInfo = await oauthApi.userinfo.get();

  return userInfo.data.email;
}

export async function fetchEventsTimeSlots(token: string): Promise<TimeSlot[][]> {
  const calendar = await google.calendar('v3');

  oauth2Client.setCredentials({
    access_token: token,
  });

  const calendarsPromise = [];
  let nextPageToken = undefined;

  while (nextPageToken !== null) {
    const gcal: any = await calendar.calendarList.list({
      auth: oauth2Client,
      pageToken: nextPageToken,
    });

    calendarsPromise.push(...await gcal.data.items.map(
      async (cal: any) => await importCalendar(cal, calendar),
    ));

    nextPageToken = gcal.data.nextPageToken;
    if (nextPageToken === undefined) {
      nextPageToken = null;
    }
  }
  return Promise.all(calendarsPromise).then((completed) => { return completed; });
}

function isValid(googleEvent: calendar_v3.Schema$Event): boolean {
  return googleEvent !== undefined
    && googleEvent.start !== undefined
    && googleEvent.start.dateTime !== undefined
    && googleEvent.transparency !== 'transparent';
}

async function importCalendar(
  googleCalendar: calendar_v3.Schema$CalendarListEntry,
  calendar: calendar_v3.Calendar): Promise<TimeSlot[]> {

  const eventsPromise: TimeSlot[] = [];

  let nextPageToken = undefined;

  while (nextPageToken !== null) {

    const events: any = await calendar.events.list({
      auth: oauth2Client,
      calendarId: googleCalendar.id,
      pageToken: nextPageToken,
    });

    eventsPromise.push(events.data.items
      .filter((e: any) => isValid(e))
      .map((e: any) => loadGoogleEvent(e)),
    );

    nextPageToken = events.data.nextPageToken;
    if (nextPageToken === undefined) {
      nextPageToken = null;
    }
  }

  const eventsToAdd = await Promise.all(eventsPromise).then((completed) => { return completed; });

  return eventsToAdd;
}

function loadGoogleEvent(googleEvent: calendar_v3.Schema$Event): TimeSlot {
  return new TimeSlot(
    new Date(googleEvent.start.dateTime),
    googleEvent.end.dateTime
      ? new Date(googleEvent.end.dateTime)
      : new Date(googleEvent.start.dateTime),
  );
}
