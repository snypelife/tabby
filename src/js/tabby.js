!function (root, k) {

  'use strict';

  function Tabby() {
    this.db     = root.localStorage
    this.listEl = k.get('.list-body')
    this.bills  = this.db.getItem('bills')
    this.bills  = this.bills ? JSON.parse(this.bills) : []
    this.today  = new Date().toISOString()
    this.today  = this.today.slice(0, this.today.indexOf('T'))
  }

  Tabby.prototype.start = function () {
    resetInputs(this)

    for (var i = 0; i < this.bills.length; i++) {
      this.listEl.appendChild(new this.bill(this.bills[i]))
    }

    return this
  }

  Tabby.prototype.add = function (bill) {
    this.listEl.appendChild(new this.bill(bill))

    this.bills.push(bill)

    return this
  }

  Tabby.prototype.paid = function (billID) {
    k.get('[data-id="' + billID + '"]').classList.add('bill-paid')

    for (var i = 0; i < this.bills.length; i++) {
      if (billID === this.bills[i].ID + '') {
        this.bills[i].paid = true
        break
      }
    }

    return this
  }

  Tabby.prototype.remove = function (billID) {
    this.listEl.removeChild(k.get('[data-id="' + billID + '"]'))

    for (var i = 0; i < this.bills.length; i++) {
      if (billID === this.bills[i].ID + '') {
        this.bills.slice(i, 1)
        break
      }
    }

    return this
  }

  Tabby.prototype.update = function () {
    resetInputs(this)

    this.db.setItem('bills', JSON.stringify(this.bills))

    return this
  }

  Tabby.prototype.clear = function () {
    while (this.listEl.firstChild) {
      this.listEl.removeChild(this.listEl.firstChild)
    }

    this.bills = []

    return this
  }

  function resetInputs(self) {
    k.get('#new-bill-name').value   = ''
    k.get('#new-bill-amount').value = ''
    k.get('#new-bill-date').value   = self.today
  }

  root.tabby = new Tabby()

}(window, _q)
