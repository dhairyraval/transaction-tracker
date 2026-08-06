### Index descriptions:
* ```transactionSchema.index({ date: -1 });```
    * Chronological sorting by date (descending)

* ```transactionSchema.index({ amount: -1 });```
    * Chronological sorting by amount (descending)

* ```transactionSchema.index({ type: 1, date: -1 });```
    * Group by type + sort by date (desc.)
* ```transactionSchema.index({ type: 1, amount: -1 });```
    * Group by type + sort by amount (desc.)

* ```transactionSchema.index({ category: 1, date: -1 });```
    * Group by category + sort by date (desc.)
* ```transactionSchema.index({ category: 1, amount: -1 });```
    * Group by category + sort by amount (desc.)
* ```transactionSchema.index({ description: 'text', category: 'text' });```
    * Searchable index for both description and category -- used in search bar