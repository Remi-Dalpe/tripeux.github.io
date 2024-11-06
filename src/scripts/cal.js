'use strict';

///////////////////////////////////////
// Calendar
document.addEventListener('DOMContentLoaded', function () {
  ///////////////////////////////////////
  // init calendar
  const calendar = new FullCalendar.Calendar(document.getElementById('calendar'), {
    initialView: 'dayGridMonth',

    // Event Click
    eventClick: function (info) {
      const eventDate = info.event.start;
      highlightDate(eventDate);
    },

    // Date Click (When a date is clicked)
    dateClick: function (info) {
      highlightDate(info.date);
    },

    events: [
      {title: 'Course 1', start: '2024-11-01T16:30'},
      {title: 'Course 2', start: '2024-11-05T16:30'},
      {title: 'Nage 2', start: '2024-11-01T16:30'},
    ],
  });

  // Function to highlight the selected date
  function highlightDate(date) {
    const formattedDate = new Date(date).toISOString().split('T')[0]; // Convert to YYYY-MM-DD format

    // Add highlight class to the selected date cell
    const selectedDateCell = document.querySelector(`.fc-day[data-date="${formattedDate}"]`);
    if (selectedDateCell) {
      selectedDateCell.classList.add('selected-date');
    }
  }

  function unselectCell() {
    const dateCells = document.querySelectorAll('.fc-daygrid-day');
    dateCells.forEach(cell => {
      cell.classList.remove('selected-date');
    });
  }

  document.addEventListener('click', function () {
    unselectCell();
  });

  document.addEventListener('keydown', function () {
    unselectCell();
  });

  calendar.render();

  ///////////////////////////////////////
  // Calendar controls
  const controls = document.querySelector(`.calendar__controls`);
  if (controls) {
    ///////////////////////////////////////
    // Go to date & highlight
    document.querySelector('#goToDate').addEventListener('click', () => {
      const dateInput = document.querySelector('#goDate').value;
      const date = new Date(dateInput);

      calendar.gotoDate(date);
      setTimeout(() => highlightDate(date), 1);
    });

    ///////////////////////////////////////
    // Create event / recuring event
    document.querySelector('#createEvent').addEventListener('click', () => {
      const title = document.getElementById('eventTitle').value;
      const date = document.getElementById('eventDate').value;
      const count = document.getElementById('count') ? document.getElementById('count').value : 1; // Default count to 1 if not provided

      if (title && date) {
        // Check if Create Event button is clicked
        const btnEvent = document.getElementById('createEvent');
        const btnRecurringEvent = document.getElementById('createRecurringEvent');

        if (btnEvent && btnEvent === document.activeElement) {
          const regularEvent = {
            title: title,
            date: date,
          };
          calendar.addEvent(regularEvent);
          setTimeout(() => highlightDate(date), 1);
        } else if (btnRecurringEvent && btnRecurringEvent === document.activeElement) {
          // Define a recurring event (weekly, with specified count)
          const recurringEvent = {
            title: title,
            date: date,
            rrule: {
              freq: 'weekly',
              count: parseInt(count, 10), // Convert count to integer
            },
          };
          calendar.addEvent(recurringEvent);
          setTimeout(() => highlightDate(date), 1);
        }

        document.getElementById('eventTitle').value = '';
        document.getElementById('eventDate').value = '';
        document.getElementById('count').value = '';
      } else {
        alert('Please fill out all fields!');
      }
    });

    ///////////////////////////////////////
    // Search event
    document.getElementById('eventSearch').addEventListener('input', e => {
      const searchTerm = e.target.value.toLowerCase();
      const events = calendar.getEvents();

      // Clear any previously highlighted cells
      unselectCell();

      // Loop through the events and highlight the ones that match the search term
      events.forEach(event => {
        if (event.title.toLowerCase().includes(searchTerm)) {
          highlightDate(event.start);
        }
      });
    });
  }
});
