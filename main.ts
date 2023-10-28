type Calendar = GoogleAppsScript.Calendar.Calendar
type CalendarEvent = GoogleAppsScript.Calendar.CalendarEvent

/**
 * 
 * @param calendar Calendar object
 * @param startDate  start Date object
 * @param endDate end Date object
 * @returns string: formatted array events
 * @returns number: total number of HW
 * @returns number: total number of Quizzes
 * @returns number: total number of PT
 */
function eventFormat(calendar: Calendar, startDate: Date, endDate: Date) : [string, number, number, number] {
    // get events then filter them to exclude "undefined" events (i don't know why they exist)
    const eventsArray: Array<CalendarEvent> = calendar.getEvents(startDate, endDate).filter(event => event !== undefined)
    
    // distinguishes between all-day events and events with specific time
    let eventsStringArray: Array<string> = eventsArray.map(event => {
        if (event.isAllDayEvent()) {
            return `<p><span style="font-weight: bold;">No spec. time</span>: ${event.getTitle()}</p>`
        } else {
            const startTime = new Date(event.getStartTime().getTime())
            const endTime = new Date(event.getEndTime().getTime())
            
            // email formatting
            const options = {hour: '2-digit', minute: '2-digit'} as const
            return `<p><span style="font-weight: bold;">${startTime.toLocaleTimeString("en-PH", options)} - ${endTime.toLocaleTimeString("en-PH", options)}</span>: ${event.getTitle()}</p>`
        }
    })

    let hwCount = 0, quizCount = 0, ptCount = 0
    eventsArray.forEach(event => {
        switch (event.getColor()) {
            case CalendarApp.EventColor.YELLOW.toString():  // yellow
                ptCount++
                break
            case CalendarApp.EventColor.MAUVE.toString():   // grape
                quizCount++
                break
            case CalendarApp.EventColor.GREEN.toString():   // basil
                hwCount++
                break
        }
    })

    return [eventsStringArray.join('\n'), hwCount, quizCount, ptCount]
}

// split by newlines then remove first and last element (which are empty strings)
let cleanEmails = ((emailList: string) => {
    return emailList.split('\n').slice(1, -1).map((str) => str.trim()).join(',')
})

function calendarReminderSystem() {
    // get calendar
    let calendar: Calendar = CalendarApp.getOwnedCalendarById(CALENDAR_ID)
    console.log(`Calendar: ${calendar.getName()}`)

    // get date
    let now = new Date()
    let nowMidnight = new Date(now.getTime())
    nowMidnight.setHours(0, 0, 0, 0)
    let endMidnight = new Date(nowMidnight.getTime() + RANGE * DAY)
    endMidnight.setHours(23, 59, 59, 999)
    console.log(`now: ${now.getTime()}, ${RANGE} from now: ${endMidnight.getTime()}`)

    // email addresses
    const sharedUsers = cleanEmails(EMAIL_ADDRESSES)
    console.log(`Users: ${sharedUsers}`)

    let htmlBody = ""
    htmlBody += `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Roboto:ital@0;1&display=swap');
    </style>
    <div style="font-family: Roboto, Arial, sans-serif; font-size: 1.2em">
        <p>Good day! These are the following events for the next 7 days, from now until ${endMidnight.toLocaleDateString("en-PH")}.</p>
        <br/><br/>
    `

    let currentDate = now
    let totalHW = 0, totalQuiz = 0, totalPT = 0
    while (currentDate.getTime() < endMidnight.getTime()) {
        let midnight = new Date(currentDate.getTime())
        midnight.setHours(23, 59, 59, 999)

        let [sortedEvents, hwCount, quizCount, ptCount] = eventFormat(calendar, currentDate, midnight)
        totalHW += hwCount
        totalQuiz += quizCount
        totalPT += ptCount
        console.log(currentDate.toLocaleDateString("en-PH", { year:"numeric", month:"short", day:"numeric" }))
        console.log(sortedEvents)

        htmlBody += `
        <p style="font-weight: bold; font-size: 1.5em;">
            ${currentDate.toLocaleDateString("en-PH", { year:"numeric", month:"short", day:"numeric" })} - 
            ${currentDate.toLocaleDateString("en-PH", { weekday: 'long' })}
        </p>
        ${sortedEvents}
        <br/>
        `

        currentDate.setHours(0, 0, 0, 0)
        currentDate = new Date(currentDate.getTime() + 1 * DAY)
    }
    console.log(`HW: ${totalHW}, Quiz: ${totalQuiz}, PT: ${totalPT}`)
    htmlBody += (totalQuiz > 0) ? `<p><span style="font-weight: bold;"># of quizzes this week</span>: ${totalQuiz}</p>` : ""
    htmlBody += (totalHW > 0)   ? `<p><span style="font-weight: bold;"># of HWs this week</span>: ${totalHW}</p>` : ""
    htmlBody += (totalPT > 0)   ? `<p><span style="font-weight: bold;"># of PTs this week</span>: ${totalPT}</p>` : ""
    htmlBody += `
        <p>Over the next 7 days (+ tonight), there are an average of ${(totalQuiz / RANGE).toFixed(2)} quizzes per day, 
        ${(totalHW / (RANGE + 1)).toFixed(2)} HWs per day, and ${(totalPT / (RANGE + 1)).toFixed(2)} PTs per day.<p>
        <br/><p style="font-style: italic;">
            This message was generated by the Calendar Reminder System (CRS) using Google Apps Script, 
            Google Cloud Console in TypeScript. If there are any problems or concerns, please contact 
            <a href="mailto:juanvillegas070825@gmail.com">juanvillegas070825@gmail.com</a> or 
            <a href="mailto:406946150626@ncr2.deped.gov.ph">406946150626@ncr2.deped.gov.ph</a>. GitHub
            repository at <a href="https://github.com/unovil/CRS">github.com/unovil/CRS</a>.
        </p>
    </div>`

    MailApp.sendEmail(sharedUsers, `${isTesting?"TESTING::":""}Events for ${nowMidnight.toLocaleDateString("en-PH", { weekday: 'long', year:"numeric", month:"short", day:"numeric"})}`, "", {
        htmlBody: htmlBody,
        name: TITLE,
        cc: CC_EMAIL_ADDRESSES
    })
}
