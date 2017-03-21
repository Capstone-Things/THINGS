/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen
See LICENSE.txt for full information.
*/
/*
*   SQL Commands to Create Database Schema
*   README
*     To rebuild the THINGS data base from scratch completely destroying the existing
*     one, execute this SQL file.
*
*   Important Notes:
*    1) item_name is not restricted to being unique. The item_id is the primary key
*      so it is the only column that needs to be unique. It is the front-ends job to
*      run a query to check if an item already exists with the same name as the one being
*      inserted and inform the user forcing them to enter a unique name.
*    2) When a row is inserted into the transaction table a function is triggered that
*      adds/subtracts the qty_changed from the item in the items table. It also sets the
*      qty_remaining attribute in the new transaction to the proper value obtained from
*      the items table.
*/

-- Create Database Commands --


    -- Completely wipe the database and all things schema. --
    DROP SCHEMA things CASCADE;

    -------------------------------------------------------------------
    CREATE SCHEMA things;

    -------------------------------------------------------------------
    CREATE TABLE all_items (
        item_id SERIAL,
        item_name   text    NOT NULL,
        description text,
        price       money,
        quantity    int NOT NULL DEFAULT 0,
        threshold   int NOT NULL,
        dateCreated timestamp DEFAULT CURRENT_TIMESTAMP,
        is_hidden   bool NOT NULL DEFAULT false,
        CHECK(quantity >= 0),
        CHECK(threshold >= 0),
        CHECK(price >= 0::money),
        PRIMARY KEY (item_id)
    );

    -------------------------------------------------------------------
    CREATE TABLE transactions (
        transaction_id  SERIAL,
        item_id         int NOT NULL REFERENCES all_items(item_id),
        person          text    NOT NULL DEFAULT 'anonymous',
        qty_changed     int		 NOT NULL,
        qty_remaining   int,
        timestamp       timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (transaction_id)
    );

    -------------------------------------------------------------------
    CREATE TABLE tags (
        tag_name    text,
        item_id int REFERENCES all_items (item_id),
        PRIMARY KEY (tag_name, item_id)
    );

    -------------------------------------------------------------------
    CREATE TABLE users (
        username    text,
        password    text NOT NULL,
        admin       boolean NOT NULL DEFAULT false,
        PRIMARY KEY (username)
    );

    -------------------------------------------------------------------
    CREATE FUNCTION set_qty_remaining() RETURNS trigger AS $set_qty_remaining$
        BEGIN
            UPDATE all_items
            SET quantity = (quantity + NEW.qty_changed)
            WHERE item_id = NEW.item_id;

            NEW.qty_remaining = (
                SELECT quantity
                FROM all_items
                WHERE item_id = NEW.item_id
            );

            RETURN NEW;
        END;
    $set_qty_remaining$ LANGUAGE plpgsql;

    -------------------------------------------------------------------
    CREATE TRIGGER set_qty_remaining BEFORE INSERT ON transactions
        FOR EACH ROW EXECUTE PROCEDURE set_qty_remaining();


    -------------------------------------------------------------------
    CREATE OR REPLACE FUNCTION item_id_with_name(text)
    RETURNS int LANGUAGE SQL AS
    $$ SELECT item_id FROM all_items WHERE item_name = $1; $$;

    -------------------------------------------------------------------
    CREATE VIEW items AS
        SELECT *
        FROM all_items
        WHERE is_hidden = false;

    -------------------------------------------------------------------
    CREATE VIEW inventory AS
        SELECT *
        FROM items NATURAL JOIN tags;

    -------------------------------------------------------------------
    CREATE OR REPLACE VIEW checkout_per_day AS
        SELECT a.item_name, a.item_id,
            CASE WHEN b.checkout_per_day is NULL THEN 0 ELSE ABS(b.checkout_per_day) END AS checkout_per_day , a.day_of_week
        FROM
            (
                SELECT *
                FROM
                (
                    SELECT item_id, item_name
                    FROM items
                ) aa
                CROSS JOIN
                (
                    SELECT '1' AS weekdaynum, 'Sunday' AS day_of_week  UNION ALL
                    SELECT '2', 'Monday'                 UNION ALL
                    SELECT '3', 'Tuesday'                UNION ALL
                    SELECT '4', 'Wednesday'              UNION ALL
                    SELECT '5', 'Thursday'               UNION ALL
                    SELECT '6', 'Friday'                 UNION ALL
                    SELECT '7', 'Saturday'
                ) bb
            ) a
        LEFT JOIN
        (SELECT item_id, item_name, SUM(qty_changed) AS checkout_per_day, to_char(timestamp, 'D') AS weekdaynum
            FROM (items NATURAL JOIN transactions)
            WHERE qty_changed < 0 AND timestamp > (current_timestamp - INTERVAL 1 WEEK)
            GROUP BY item_id, item_name, weekdaynum) AS b
        ON a.item_id = b.item_id AND a.weekdaynum = b.weekdaynum;
