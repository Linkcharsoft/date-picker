const selector = document.querySelectorAll('.Selector')
const departureSelector = document.getElementById('departure-selector')
const departureInsideSelectors = document.querySelectorAll('#departure-inside-selector')
const departureItemsDate= document.querySelectorAll('.Selector__Item-Departure')
const departurePrevButton = document.querySelectorAll('.Selector__Item-Button--Departure-Prev')
const departureNextButton = document.querySelectorAll('.Selector__Item-Button--Departure-Next')
const returnSelector = document.getElementById('return-selector')
const returnInsideSelectors = document.querySelectorAll('#return-inside-selector')
const returnItemsDate = document.querySelectorAll('.Selector__Item-Return')
const returnPrevButton = document.querySelectorAll('.Selector__Item-Button--Return-Prev')
const returnNextButton = document.querySelectorAll('.Selector__Item-Button--Return-Next')

const calendar = document.getElementById('calendar')
const restartButton = document.querySelectorAll('#restart-button')
const submitButton = document.getElementById('submit-button')
const closeMobileButton = document.getElementById('close-mobile-button')

const monthSlider = document.getElementById('month-slider')
const monthsContainer = document.getElementById('months-container')
const prevMonthButton = document.getElementById('prev-month')
const nextMonthButton = document.getElementById('next-month')

const typeSelector = document.querySelectorAll('#type-selector')
const typeSelectorOptions = document.querySelectorAll('#type-options')
const typeDepartureAndReturn = document.querySelectorAll('#type-departure-and-return')
const typeDepartureOnly = document.querySelectorAll('#type-departure-only')

// Constants
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const types = ['departure-and-return', 'departure-only']

// Current date data
const currentDate = new Date()
currentDate.setHours(0, 0, 0, 0)
const currentMonth = currentDate.getMonth()
const currentYear = currentDate.getFullYear()

// Last available day
const lastDayOfCalendar = new Date()
lastDayOfCalendar.setMonth(lastDayOfCalendar.getMonth() + 12)
lastDayOfCalendar.setDate(lastDayOfCalendar.getDate() - 1)
lastDayOfCalendar.setHours(0, 0, 0, 0)

// Variables
let typeSelected = 'departure-and-return'
let selectedDateToChange = 'departure'
let departureDate = null
let returnDate = null

// Set calendar
const renderCalendar = () => {
  for (let i = 0; i < 13; i++) {
    // Get month and year for each month
    const month = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);

    // Obtener el primer día del mes
    const firstDay = new Date(year, month, 1).getDay();

    // Obtener el número de días en el mes
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Crear las celdas para cada día del mes
    const monthDays = []
    for (let j = 0; j < 42; j++) {
      const day = {
        number: '',
        status: 'normal'
      }
      const dayNumber = j - firstDay + 1
      const dayTime = new Date(year, month, dayNumber).getTime()

      // Crear celdas vacias para los dias pasados un año
      if (j < firstDay || j >= firstDay + daysInMonth) {
        // Crear celdas vacías antes del primer día del mes y después del último día del mes
        day.status = 'blank'
      // Deshabiliar dias anteriores al dia actual
      } else if (year < currentDate.getFullYear() || (year === currentDate.getFullYear() && month < currentDate.getMonth()) || (year === currentDate.getFullYear() && month === currentDate.getMonth() && j - firstDay + 1 < currentDate.getDate()) || dayTime > lastDayOfCalendar.getTime()) {
        day.number = dayNumber
        day.status = 'disabled'
      } else {
        // Crear celdas con los días del mes
        day.number = dayNumber;

        // if(departureDate && returnDate && dayTime > departureDate.getTime() && dayTime < returnDate.getTime()) {
        //   day.status = 'range'
        // } else if (departureDate && dayNumber === departureDate.getDate() && month === departureDate.getMonth() && year === departureDate.getFullYear()) {
        //   if(returnDate) day.status = 'departure'
        //   else day.status = 'departure-no-range'
        // } else if (returnDate && dayNumber === returnDate.getDate() && month === returnDate.getMonth() && year === returnDate.getFullYear()) {
        //   day.status = 'return'
        // }
        if(departureDate && returnDate && dayTime > departureDate.getTime() && dayTime < returnDate.getTime()) {
          day.status = 'range'
        } else if (departureDate && dayNumber === departureDate.getDate() && month === departureDate.getMonth() && year === departureDate.getFullYear()) {
          if(selectedDateToChange === 'departure' && returnDate) day.status = 'current-selected'
          else if(selectedDateToChange === 'return' && returnDate) day.status = 'other-selected'
          else day.status = 'departure-no-range'
        } else if (returnDate && dayNumber === returnDate.getDate() && month === returnDate.getMonth() && year === returnDate.getFullYear()) {
          if(selectedDateToChange === 'return' && departureDate) day.status = 'current-selected'
          else if(selectedDateToChange === 'departure' && departureDate) day.status = 'other-selected'
        }
      }

      monthDays.push(day)
    }

    renderMonth({
      month: monthNames[month],
      year: year !== currentYear ? year : null,
      days: monthDays,
    })
  }
}

const renderMonth = ({ month, year, days }) => {
  const dayStatus = {
    normal: 'Month__Day',
    blank: 'Month__Day--Blank',
    disabled: 'Month__Day--Disabled',
    range: 'Month__Day--Range',
    'current-selected': selectedDateToChange === 'departure' ? 'Month__Day--Departure-Current-Selected' : 'Month__Day--Return-Current-Selected',
    'departure-no-range': 'Month__Day--Current-Selected-NoRange',
    'other-selected': selectedDateToChange === 'return' ? 'Month__Day--Departure-Other-Selected' : 'Month__Day--Return-Other-Selected',
  }

  const monthContainer = document.createElement('section')
  monthContainer.classList.add('Month')
  monthContainer.innerHTML = `
    <header class="Month__Header">
      <h6 class="Month__Name">${ month } ${year ? `- ${year}` : ''}</h6>
      <div class="Month__Weekdays">
        <div class="Month__Weekday">M</div>
        <div class="Month__Weekday">T</div>
        <div class="Month__Weekday">W</div>
        <div class="Month__Weekday">T</div>
        <div class="Month__Weekday">F</div>
        <div class="Month__Weekday">S</div>
        <div class="Month__Weekday">S</div>
      </div>
    </header>
  `

  const monthDaysContainer = document.createElement('div')
  monthDaysContainer.classList.add('Month__Days')
  days.forEach(data => {
    const day = document.createElement('div')
    day.classList.add(dayStatus[data.status])
    day.textContent = data.number
    day.dataset.number = data.number

    if(data.status !== 'blank' && data.status !== 'disabled') {
      day.addEventListener('click', (event) => {
        const target = event.target
        const month = day.closest('.Month')
        const monthName = month.querySelector('.Month__Name').textContent
        const dayNumber = day.textContent

        const date = new Date(`${monthName} ${dayNumber}, ${currentYear}`)

        if (typeSelected === 'departure-and-return') {
          if(selectedDateToChange == 'departure') {
            if(date.getTime() >= currentDate.getTime()) {
              if(!departureDate || (returnDate && date.getTime() > returnDate?.getTime())) {
                returnDate = null
              }
              departureDate = date
              selectedDateToChange = 'return'
              target.classList.add(dayStatus['departure-no-range'])
            }
          }

          if(selectedDateToChange == 'return') {
            if(date.getTime() > departureDate.getTime()) {
              returnDate = date
              selectedDateToChange = 'departure'
              target.classList.remove(dayStatus['departure-no-range'])
            } else {
              departureDate = date
              selectedDateToChange = 'return'
              target.classList.add(dayStatus['departure-no-range'])
            }
          }
        } else {
          departureDate = date
          target.classList.add(dayStatus['departure-no-range'])
        }

        setSubmitStatus()
        setDateOnSelector()
        renderCalendar()
      })
    }

    monthDaysContainer.appendChild(day)
  })
  monthContainer.appendChild(monthDaysContainer)

  if(Array.from(monthsContainer.children).length == 13) {
    monthsContainer.innerHTML = ''
    monthsContainer.appendChild(monthContainer)
  } else {
    monthsContainer.appendChild(monthContainer)
  }

}

const setSlider = () => {
  // Set slider
  // const monthItemWidth = document.querySelector('.Month').offsetWidth;
  const monthItemWidth = 368;
  const maxTranslateX = monthItemWidth * 11;
  let currentTranslateX = 0;

  // Show or hide buttons depending on the current position
  function toggleButtons() {
    if (currentTranslateX === 0) {
      prevMonthButton.style.display = 'none';
    } else {
      prevMonthButton.style.display = 'block';
    }

    if (currentTranslateX === maxTranslateX) {
      nextMonthButton.style.display = 'none';
    } else {
      nextMonthButton.style.display = 'block';
    }
  }

  // Move slider to the left
  function moveLeft() {
    currentTranslateX -= monthItemWidth;
    if (currentTranslateX < 0) {
      currentTranslateX = 0;
    }
    monthsContainer.scroll({
      top: 0,
      left: currentTranslateX,
      behavior: 'smooth'
    })
    toggleButtons();
  }

  // Move slider to the right
  function moveRight() {
    currentTranslateX += monthItemWidth;
    if (currentTranslateX > maxTranslateX) {
      currentTranslateX = maxTranslateX;
    }
    monthsContainer.scroll({
      top: 0,
      left: currentTranslateX,
      behavior: 'smooth'
    })
    toggleButtons();
  }

  // Add event listeners to month buttons
  prevMonthButton.addEventListener('click', moveLeft);
  nextMonthButton.addEventListener('click', moveRight);

  // Hide left button if slider is in the first month
  prevMonthButton.style.display = 'none';
}

const setTypeSelector = () => {
  const selectorIcons = document.querySelectorAll('.Calendar__Selector-Icon')
  const optionOneIcons = document.querySelectorAll('.Calendar__Selector-Option-Icon-One')
  const optionTwoIcons = document.querySelectorAll('.Calendar__Selector-Option-Icon-Two')

  const resetCalendarBySelector = () => {
    typeSelector.forEach((selector, index) => {
      selector.appendChild(selectorIcons[index])
    })
    typeSelectorOptions.forEach(container => {
      container.classList.remove('Calendar__Selector-Options-Active')
    })
    departureDate = null
    returnDate = null
    setDateOnSelector()
    setSubmitStatus()
    renderCalendar()
  }

  typeSelector.forEach(selector => {
    selector.addEventListener('click', () => {
      typeSelectorOptions.forEach(container => {
        container.classList.toggle('Calendar__Selector-Options-Active')
      })
    })
  })

  typeDepartureAndReturn.forEach(option => {
    option.addEventListener('click', () => {
      // Change type and show check icon
      typeSelected = 'departure-and-return'
      typeSelector.forEach(selector => {
        selector.textContent = `Round trip`
      })
      typeDepartureAndReturn.forEach((_, index) => {
        optionOneIcons[index].style.display = 'block'
        optionTwoIcons[index].style.display = 'none'
      })

      // Show return date selector
      selector.forEach(selector => {
        const divisor = selector.querySelector('.Selector__Divisor')
        divisor.style.display =  'block'
        const returnDate = selector.querySelectorAll('.Selector__Item')
        returnDate[1].style.display = 'flex'
      })

      // Reset calendar
      resetCalendarBySelector()
    })
  })

  typeDepartureOnly.forEach(option => {
    option.addEventListener('click', () => {
      // Change type and show check icon
      typeSelected = 'departure-only'
      typeSelector.forEach(selector => {
        selector.textContent = `One way`
      })
      typeDepartureOnly.forEach((_, index) => {
        optionOneIcons[index].style.display = 'none'
        optionTwoIcons[index].style.display = 'block'
      })

      // Hide return date selector
      selector.forEach(selector => {
        const divisor = selector.querySelector('.Selector__Divisor')
        divisor.style.display =  'none'
        const returnDate = selector.querySelectorAll('.Selector__Item')
        returnDate[1].style.display = 'none'
      })

      // Reset calendar
      resetCalendarBySelector()
    })
  })
}

const setFocusOnSelector = () => {
  if(selectedDateToChange == 'departure') {
    departureInsideSelectors.forEach(selector => {
      selector.classList.add('Selector__Item-Data--Focus')
    })
    returnInsideSelectors.forEach(selector => {
      selector.classList.remove('Selector__Item-Data--Focus')
    })
  } else {
    departureInsideSelectors.forEach(selector => {
      selector.classList.remove('Selector__Item-Data--Focus')
    })
    returnInsideSelectors.forEach(selector => {
      selector.classList.add('Selector__Item-Data--Focus')
    })
  }

  renderCalendar()
}

const changeSelectedDate = (selector) => {
  if (typeSelected === 'departure-and-return') {
    if(selector == 'departure') {
      selectedDateToChange = 'departure'
    } else if(departureDate) {
      selectedDateToChange = 'return'
    }
  } else {
    selectedDateToChange = 'departure'
  }
  setFocusOnSelector()
}

const setDateOnSelector = () => {
  if (departureDate) {
    departureItemsDate.forEach(selector => {
      selector.innerHTML = departureDate.toLocaleDateString(navigator.language, {
        weekday: "short",
        day: '2-digit',
        month: 'short'
      })
    })
  } else {
    departureItemsDate.forEach(selector => {
      selector.innerHTML = 'Departure'
    })
  }

  if (returnDate) {
    returnItemsDate.forEach(selector => {
      selector.innerHTML = returnDate.toLocaleDateString(navigator.language, {
        weekday: "short",
        day: '2-digit',
        month: 'short'
      })
    })
  } else {
    returnItemsDate.forEach(selector => {
      selector.innerHTML = 'Return'
    })
  }

  setFocusOnSelector()
}

const openCalendar = () => {
  calendar.style.display = 'flex'
  calendar.focus()
  setFocusOnSelector()
}

const closeCalendar = () => {
  calendar.style.display = 'none'
}

const resetCalendar = () => {
  selectedDateToChange = 'departure'
  departureDate = null
  returnDate = null
  departureItemsDate.forEach(selector => {
    selector.innerHTML = 'Departure'
  })
  returnItemsDate.forEach(selector => {
    selector.innerHTML = 'Return'
  })
  setSubmitStatus()
  setFocusOnSelector()
  renderCalendar()
}

const prevDay = (selector) => {
  if(selector === 'departure' && departureDate) {
    const newDate = new Date(departureDate)
    newDate.setDate(newDate.getDate() - 1)
    const newDateTime = newDate.getTime()

    if(newDateTime >= currentDate.getTime()) {
      departureDate = newDate
      renderCalendar()
    }
  }
  if(selector === 'return' && returnDate) {
    const newDate = new Date(returnDate)
    newDate.setDate(newDate.getDate() - 1)
    const newDateTime = newDate.getTime()

    if(newDateTime >= currentDate.getTime() && newDateTime > departureDate.getTime()) {
      returnDate = newDate
      renderCalendar()
    }
  }
  setDateOnSelector()
}

const nextDay = (selector) => {
  if(selector === 'departure' && departureDate) {
    const newDate = new Date(departureDate)
    newDate.setDate(newDate.getDate() + 1)
    const newDateTime = newDate.getTime()

    if(returnDate) {
      if(newDateTime < returnDate.getTime()) {
        departureDate = newDate
        renderCalendar()
      }
    } else if(newDateTime <= lastDayOfCalendar.getTime()) {
      departureDate = newDate
      renderCalendar()
    }
  }
  if(selector === 'return' && returnDate) {
    const newDate = new Date(returnDate)
    newDate.setDate(newDate.getDate() + 1)
    const newDateTime = newDate.getTime()

    // Check if the new date is lower than last day of the calendar
    if(newDateTime <= lastDayOfCalendar.getTime()) {
      returnDate = newDate
      renderCalendar()
    }
  }
  setDateOnSelector()
}

const setSubmitStatus = () => {
  if(typeSelected === 'departure-and-return' && departureDate && returnDate) {
    submitButton.classList.add('Calendar__Submit--Active')
  } else if(typeSelected === 'departure-only' && departureDate) {
    submitButton.classList.add('Calendar__Submit--Active')
  } else {
    submitButton.classList.remove('Calendar__Submit--Active')
  }
}

const submitCalendar = () => {
  if(typeSelected === 'departure-and-return' && departureDate && returnDate) {
    console.log('Departure: ', departureDate)
    console.log('Return: ', returnDate)
  } else if(typeSelected === 'departure-only' && departureDate) {
    console.log('Departure: ', departureDate)
  }

  closeCalendar()
}

const initCalendar = () => {
  renderCalendar()
  setSlider()
  setTypeSelector()
}


// Open calendar
departureSelector.addEventListener('click', () => {
  openCalendar()
  changeSelectedDate('departure')
})
returnSelector.addEventListener('click', () => {
  openCalendar()
  changeSelectedDate('return')
})

// Close calendar
calendar.addEventListener('blur', (e) => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches
  const needCloseCalendar = calendar.contains(e.relatedTarget) ? false : true

  if(!isMobile) {
    if(needCloseCalendar) closeCalendar()
    else calendar.focus()
  }
})
closeMobileButton.addEventListener('click', closeCalendar)

departureInsideSelectors.forEach(selector => {
  selector.addEventListener('click', () => changeSelectedDate('departure'))
})
returnInsideSelectors.forEach(selector => {
  selector.addEventListener('click', () => changeSelectedDate('return'))
})

departureNextButton.forEach(button => {
  button.addEventListener('click', () => nextDay('departure'))
})
returnNextButton.forEach(button => {
  button.addEventListener('click', () => nextDay('return'))
})
departurePrevButton.forEach(button => {
  button.addEventListener('click', () => prevDay('departure'))
})
returnPrevButton.forEach(button => {
  button.addEventListener('click', () => prevDay('return'))
})

restartButton.forEach(button => {
  button.addEventListener('click', resetCalendar)
})
submitButton.addEventListener('click', submitCalendar)

initCalendar()