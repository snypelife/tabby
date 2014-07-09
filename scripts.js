!function (root, _q) {

  'use strict';

  var db = root.localStorage
  var bills = db.getItem('bills')
  var list = _q.get('.list-body')
  var today = new Date().toISOString()

  bills = bills ? JSON.parse(bills) : []
  today = today.slice(0, today.indexOf('T'))
  _q.get('#new-bill-date').value = today

  updateBills(bills)


  // event listeners
  _q
  .on('click', '#add-bill-btn', function (evt) {
    var newBill = {
      name: _q.get('#new-bill-name').value
    , owed: _q.get('#new-bill-amount').value
    , date: _q.get('#new-bill-date').value
    , paid: false
    }
    bills.push(newBill)
    updateBills()
  })
  .on('click', '#remove-bills-btn', function (evt) {
    bills = []
    updateBills()
  })
  .on('click', '.pay-now-btn', function (evt) {
    bills[getBillIndex(evt.target)].paid = true
    updateBills()
  })

  .on('swipe-left', '.bill', function (evt) {
    if (evt.oTarget.classList.contains('bill-paid')) {
      evt.oTarget.classList.add('is-removing')
    }
    else {
      bills[getBillIndex(evt.target)].paid = true
      updateBills()
    }
  })

  .on('transitionComplete', '.bill-paid', function (evt) {
    bills.splice(getBillIndex(evt.target), 1)
    updateBills()
  })


  // functions
  function updateBills() {
    resetInputs()
    clearBills()

    db.setItem('bills', JSON.stringify(bills))
    bills.forEach(function (data) {
      list.appendChild(newBill(data))
    })

    // sortBills()
  }

  function clearBills() {
    if (!list.childNodes.length) {
      return
    }

    while (list.childNodes.length) {
      list.removeChild(list.firstChild)
    }
  }

  function sortBills() {
    var paid = _q.toArray(_q.getAll('.bill-paid'))
    paid = paid[0] ? paid :_q.getAll('.bill-paid')

    if (!paid.length) {
      return
    }

    if (_q.isArray(paid)) {
      if (!paid.length) {
        return
      }

      while (paid.length) {
        list.appendChild(paid.pop())
      }
    }
    else {
      list.appendChild(paid)
    }
  }

  function newBill(billData) {
    var billElement = _q.new('div')
    billElement.classList.add('bill')

    for (var key in billData) {
      var div = _q.new('div')
      var span = _q.new('span')

      switch (key) {
        case 'name':
          div.classList.add('a-4-col-small')
          span.innerHTML = billData[key]
          break
        case 'owed':
          div.classList.add('a-4-col-small')
          span.innerHTML = formatDollar(billData[key])
          break
        case 'date':
          div.classList.add('a-4-col-small')
          span.innerHTML = formatDate(billData[key])
          break
        case 'paid':
          if (true === billData[key]) {
            billElement.classList.add('bill-paid')
          }
          else {
            billElement.classList.remove('bill-paid')
          }
          div = null
          break
      }
      if (div) {
        div.appendChild(span)
        billElement.appendChild(div)
      }
    }
    return billElement
  }

  function getBillIndex(target) {
    return _q.toArray(_q.getAll('.bill')).indexOf(_q.parent(target, '.bill'))
  }

  function formatDollar(dollar) {
    return '$' + parseFloat(dollar).toFixed(2)
  }

  function formatDate(isoDate) {
    var thisYear = today.split('-')[0]
    var dateArray = isoDate.split('-')
    var year = dateArray[0]
    var month = parseInt(dateArray[1], 10)
    var day = dateArray[2]
    var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

    return year === thisYear ? monthNames[month - 1] + ' ' + day :  monthNames[month - 1] + ' ' + day + ', ' + year
  }

  function resetInputs() {
    _q.get('#new-bill-name').value = ''
    _q.get('#new-bill-amount').value = ''
    _q.get('#new-bill-date').value = today
  }
} (window, _q)
