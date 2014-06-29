var m = require('../../lib/middleware.js'),
    k = require('../../lib/kids.js'),
    t = require('../../lib/transactions.js'),
    Transactions = require('../../models/Transactions.js');

module.exports = function(app) {

  // TRANSACTIONS
  app.post('/api/transaction', t.newTransaction, k.updatePoints, function(req, res, next){
    res.json(req.transaction);
  });
  app.put('/api/transaction/:id', t.updateTransaction, k.updatePoints, function(req, res, next){
    res.json(req.transaction);
  });
  app.get('/api/transactions-by-date/:date', t.allTransactionsByDate, function(req, res, next){
    res.json(req.transactions);
  });
  app.get('/api/transactions/:id', t.allTransactions, function(req, res, next){
    res.json(req.transactions);
  });
  app.del('/api/transaction/:id', t.deleteTransaction, k.updatePoints, function(req, res, next){
    res.json();
  });

}
