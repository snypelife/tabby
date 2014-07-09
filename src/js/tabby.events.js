!function (root, k, tabby) {

  'use strict';

  var validCount = 0

  k.on('click', '#btn-add-bill', function (evt) {
    validCount = 0
    k.trigger(k.getAll('input'), 'validate')
  })
  .on('click', '#btn-remove-all-bills', function (evt) {
    tabby
    .clear()
    .update()
  })
  .on('click', '.btn-pay-now', function (evt) {
    tabby
    .paid(k.parent(evt.target, '.bill').getAttribute('data-id'))
    .update()
  })

  .on('swipe-left', '.bill', function (evt) {
    if (evt.oTarget.classList.contains('bill-paid')) {
      evt
      .oTarget
      .classList
      .add('is-removing')
    }
    else {
      tabby
      .paid(evt.oTarget.getAttribute('data-id'))
      .update()
    }
  })
  .on('submit', 'form', function (evt) {
    evt.preventDefault()
  })
  .on('validate', 'input', function (evt) {
    if (evt.target.checkValidity()) {
      validCount++
      k.trigger(evt.target, 'valid')
    }
    else {
      k.trigger(evt.target, 'invalid')
    }
  })
  .on('invalid', 'input', function (evt) {
    if (evt.target.value.length === 0) {
      evt.target.setCustomValidity('This field is required')
      return
    }
    else if (evt.target.type === 'number') {
      evt.target.setCustomValidity('Enter a valid dollar amount')
      return
    }
    else if (evt.target.type === 'date') {
      evt.target.setCustomValidity('Enter a valid date')
      return
    }
  })
  .on('valid', function (evt) {
    if (validCount === k.getAll('input').length) {
      var newBill = {
        ID: Math.floor(+new Date() + (parseFloat(k.get('#new-bill-amount').value) || 0))
      , name: k.get('#new-bill-name').value
      , owed: k.get('#new-bill-amount').value
      , date: k.get('#new-bill-date').value
      , paid: false
      }

      tabby
      .add(newBill)
      .update()
    }
  })

  .on('DOMContentLoaded', function (evt) {
    var inputs = k.getAll('input')

    for (var i = 0; i < inputs.length; i++) {
      // inputs[i].setCustomValidity('')
    }
  })

  // .on('transitionComplete', '.bill-paid', function (evt) {
  //   tabby
  //   .remove(evt.target.getAttribute('data-id'))
  //   .update()
  // })


  root.tabby.start()

}(window, _q, tabby)
