# Copy Mongo Field

This package will help you in case when you have legacy fields like **summ** and **sum** and want to copy value from the legacy to new and delete an old field.  

## Supporting JS and TS 

Below you'll see code fragments for TypeScript, but this module also supports
Javascript. Just use it like that:

```javascript
const MongoCopyField = require('./lib').MongoCopyField

const mc = await MongoCopyField.connect({
    url: ''
})
```

## How to use

There is a bit of tips about how to use this package

### Connection

You can use MongoDB connection URL

```javascript
import { MongoCopyField } from './src'

const mc = await MongoCopyField.connect({
    url: ''
})
```

Or you can use raw params like that

```javascript
import { MongoCopyField } from './src'

const mc = await MongoCopyField.connect({
    host: '',
    port: 27017,
    db: 'someDB',
    username: 'someUser',
    password: 'somePassword',
    authSource: 'authDB_if_you_wish',
})
```

### Copying

So, let's assume you wish to copy info from the field **avgSumm** to **avgSum** in the **averageCollection** collection.
You can do that and save legacy field like that

```javascript
mc.copyValues('averageCollection', 'avgSumm', 'avgSum')
```

Or you can delete legacy field

```javascript
mc.copyValues('averageCollection', 'avgSumm', 'avgSum', true)
```

### Also works

Package copying all kind of data from/to any desired destination.

For example, you could copy data from 0-level to some information object:

```javascript
mc.copyValues('comments', 'authorId', 'author._id', true)
```

### Response

copyValues now returns result

```javascript
const res = mc.copyValues('comments', 'authorId', 'author._id', true)
// { matchedCount: 8658, modifiedCount: 8658, upsertedCount: 0 }
```
