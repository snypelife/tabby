!function (root, k) {

  'use strict';

  function Bill (options) {
    this.ID   = options.ID
    this.name = options.name
    this.owed = options.owed
    this.date = options.date
    this.paid = options.paid
    this.element = k.new('div')
    this.element.classList.add('bill')

    return this.build()
  }

  Bill.prototype.build = function () {
    this.element.appendChild(newCell('name', this.name))
    this.element.appendChild(newCell('owed', formatDollar(this.owed)))
    this.element.appendChild(newCell('date', formatDate(this.date)))
    this.element.classList[true === this.paid ? 'add' : 'remove']('bill-paid')
    this.element.setAttribute('data-id', this.ID)

    var btn = k.new('button')
    btn.classList.add('btn-pay-now')
    btn.innerHTML = "pay"
    var div = k.new('div')
    div.classList.add('a-4-col-small')
    div.appendChild(btn)
    this.element.appendChild(div)

    return this.element
  }

  function newCell(name, value) {
    var div = k.new('div')
    var span = k.new('span')

    div.classList.add('a-4-col-small')
    span.classList.add(name)
    span.innerHTML = value
    div.appendChild(span)

    return div
  }

  function formatDollar(dollar) {
    return '$' + parseFloat(dollar).toFixed(2)
  }

  function formatDate(isoDate) {
    var thisYear = root.tabby.today.split('-')[0]
    var dateArray = isoDate.split('-')
    var year = dateArray[0]
    var month = parseInt(dateArray[1].slice(0, 2), 10)
    var day = dateArray[2].slice(0, 2)
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    return year === thisYear ? monthNames[month - 1] + ' ' + day :  monthNames[month - 1] + ' ' + day + ', ' + year
  }

  root.tabby.bill = Bill

}(window, _q)
