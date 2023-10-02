# Calendar Reminder System

[![clasp](https://img.shields.io/badge/built%20with-clasp-4285f4.svg)](https://github.com/google/clasp)

This is the Calendar Reminder System project for the section 10-Joule of SY 2023-2024, at Pasig City Science High School. This project uses Clasp as the main driver and TypeScript files for the typing system.

I made this project as a side hobby since I was too tired of opening our class spreadsheet every time I need to get reminders. Instead of that, I made a calendar system and email system!

## Installation

To clone and run this program, please follow first the guidelines on running locally at the Clasp GitHub page.

You would also need these files:

### Main Files

* `calendar.ts`: contains `CALENDAR_ID` or the ID used for your calendar in Google Calendar.

* `email.ts`: contains `EMAIL_ADDRESSES` and `CC_EMAIL_ADDRESSES`. Note that since `eventFilter()` in `main.ts` uses slicing, the format of the `EMAIL_ADDRESSES` should be:

    ```ts
    const EMAIL_ADDRESSES: String = `
    email_address_1
    email_address_2
    ...
    `
    ```

* `creds.json`, `.clasp.json` and `.clasprc.json`: these are the files related to pushing and authenticating with Google Cloud Console and Google Apps Script. Learn more on how to set this up on the Clasp GitHub page.

> Note: `calendar.ts` and `email.ts` are not included, and placeholder files are used instead. Rename the files and remove the `sample_` from the name.
> Warning: These files contain sensitive information. Make sure that when you push to GitHub, you have a `.gitignore` file that ignores these files.

### `constants.ts`

These contain the constants that are essential for date tracking in the email system. You can change the name of the email to be sent and the range.

## Copyright and Usage

More information found at [LICENSE](./LICENSE)

```txt
Calendar Reminder System - an automation of Google Calendar thru Mail
Copyright (C) 2023  Juan Miguel Villegas

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
```
