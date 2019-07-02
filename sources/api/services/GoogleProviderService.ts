import { google, calendar_v3 } from 'googleapis';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';

const oauth2Client = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: `${process.env.API_HOST}authenticate`,
});

const scopes = [
  'https://www.googleapis.com/auth/calendar.readonly',
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

export async function fetchEventsTimeSlots(token: string) {
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
    && googleEvent.summary !== undefined;
}

async function importCalendar(
  googleCalendar: calendar_v3.Schema$CalendarListEntry,
  calendar: calendar_v3.Calendar) {

  const eventsPromise = [];

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

  return 'Calendar';
}

function loadGoogleEvent(googleEvent: calendar_v3.Schema$Event) {
  if (googleEvent.transparency === 'opaque') {
    console.log(googleEvent);
  }
}
