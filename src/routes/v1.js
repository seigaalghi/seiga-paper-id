const express = require("express");
const { getAccounts, createAccount, getAccount, editAccount, deleteAccount, restoreAccount } = require("../controllers/account");
const { register, login } = require("../controllers/auth");
const { getSummaryDaily, getSummaryMonthly } = require("../controllers/summary");
const { createTransaction, getTransactions, getTransaction, editTransaction, deleteTransaction, restoreTransaction } = require("../controllers/transaction");
const { getUser, deleteUser, editUser, restoreUser } = require("../controllers/user");
const { auth } = require("../middlewares/tokenAuth");
const router = express.Router();

// ==================================================================
// Auth
// ==================================================================
router.post("/auth/register", register);
router.get("/auth/login", login);

// ==================================================================
// User
// ==================================================================
router.get("/user/profile", auth, getUser);
router.delete("/user/delete", auth, deleteUser);
router.put("/user/edit", auth, editUser);
router.put("/user/restore/:id", auth, restoreUser);

// ==================================================================
// Account
// ==================================================================
router.post("/account", auth, createAccount);
router.get("/accounts/:page", auth, getAccounts);
router.get("/account/:id", auth, getAccount);
router.put("/account/:id", auth, editAccount);
router.delete("/account/:id", auth, deleteAccount);
router.put("/account/restore/:id", auth, restoreAccount);

// ==================================================================
// Transaction
// ==================================================================
router.post("/transaction", auth, createTransaction);
router.get("/transactions/:accountId/:page", auth, getTransactions);
router.get("/transaction/:id", auth, getTransaction);
router.put("/transaction/:id", auth, editTransaction);
router.delete("/transaction/:id", auth, deleteTransaction);
router.put("/transaction/restore/:id", auth, restoreTransaction);

// ==================================================================
// Summary
// ==================================================================
router.get("/summary/daily/:accountId", auth, getSummaryDaily);
router.get("/summary/monthly/:accountId", auth, getSummaryMonthly);

module.exports = router;
