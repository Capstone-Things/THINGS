================== TEST CASES LIBRARY ========================
Brief: This document will outline the test plan for things API.
The document will define test cases for each route provided by the API.
Each test case will list assumptions about the database as well as
input/output pairs. The test cases will be numbered first by route
then by subtest. i.e. all tests for the view route would enumerate
as 1.1 1.2 1.N
Each test will be executed when any branch is pushed to github.com
If CI fails, the failing test number will be reported.

**************************************************************
=========================Tests Numbers========================
 # |Route Name    | Description
0: Base routes i.e. '/', '/a', '/a/admin'
1: View
2: Authenticate
3: Request
4: Checkout
5: Add new item
6: Add tag
7: Check-in
8: History
--8.1 Recent History
--8.2 By Item
--8.3 By Tag
--8.4 By Range
09: Shopping list
10: Stats
***************************************************************

***************************************************************
EXAMPLE TEMPLATE:

=======================<TEST NAME HERE>=======================
Test Number:
Route URL:
Brief:
===============================================================

Input:
  Database State- Pre transaction:

  HTTPS Request:
    METHOD:
    ROUTE:
    HEADERS:
    BODY:

Output:
  Database State- Post transaction:

  HTTP Response:
    Status code:
    Status Message:
    Headers:
    Body:

************************************************************************
======================= VIEW =======================
Test Number: 1.1
Route URL: /view
Brief: verify that /view returns the correct database state.
===============================================================

Input:
  Database State- Pre transaction:
    Table:
           items: item_id | item_name | descritption | price | quantity | threshold | tags
                    1        Pencil   |  writing tool|  $0.25|     35   |     10    | []
                    2        Pop Tart | Snack Food   | $1.00 |    12    |     4     | ['snacks', 'breakfast']
                    3       Printer Ink| Black       | $45.00|    5     |     2     | ['Printing', 'Toner']

           Tags: item_id | tag
                    2    | 'snacks'
                    2    | 'breakfast'
                    3    | 'Printing'
                    3    | 'Toner'
  HTTP REQUEST:
    METHOD: GET
    ROUTE: /view
    HEADERS:
    BODY:

Output:
  Database State- Post transaction: (database should remain unchanged.)
  Table:
         items: item_id | item_name | descritption | price | quantity | threshold | tags
                  1        Pencil   |  writing tool|  $0.25|     35   |     10    | []
                  2        Pop Tart | Snack Food   | $1.00 |    12    |     4     | ['snacks', 'breakfast']
                  3       Printer Ink| Black       | $45.00|    5     |     2     | ['Printing', 'Toner']

         Tags: item_id | tag
                  2    | 'snacks'
                  2    | 'breakfast'
                  3    | 'Printing'
                  3    | 'Toner'


  HTTP Response:
    Status code: 200
    Status Message: 'Success'
    Headers:{'Content/type': 'json'}
    Body:[{
        item_id:  1,
        item_name: 'pencil',
        description: 'writing tool',
        price: 0.25,
        quantity: 35,
        threshold: 10,
        tags: []
    },
    {
        item_id:  2,
        item_name: 'Pop Tart',
        description: 'Snack Food',
        price: 1.00,
        quantity: 12,
        threshold: 4,
        tags:['snacks', 'breakfast']
    },
    {
        item_id:  3,
        item_name: 'Printer Ink',
        description: 'Black',
        price: 45.00
        quantity: 5,
        threshold: 2,
        tags: ['Printing', 'Toner']
    }]
