/*
Copyright (c) 2016 CATTHINGS: Nicholas McHale, Andrew McCann, Susmita Awasthi,
Manpreet Bahl, Austen Ruzicka, Luke Kazmierowicz, Hillman Chen
See LICENSE.txt for full information.
*/
/*
*
*   SQL Commands to Insert Test Data into the Things Database
*
*/


-- Insert Data Example --

    ----------------------------------------------------------------------------
    INSERT INTO items (item_name, description, price, quantity, threshold) VALUES
        ('Pop-Tarts', 'A tasty snack, best consumed toasted.', 2.50, 25, 10);
    INSERT INTO tags VALUES
        ('Food', 1);
    INSERT INTO tags VALUES
        ('Perishable', 1);

    ----------------------------------------------------------------------------
    INSERT INTO items (item_name, description, price, quantity, threshold) VALUES
        ('Black & White Printer Ink', 'For Printer In FAB 88', 27.99, 8, 5);
    INSERT INTO tags VALUES
        ('Printer Supplies', 2);

    ----------------------------------------------------------------------------
    INSERT INTO items (item_name, description , price, quantity, threshold) VALUES
        ('HDMI to VGA Adapter', 'For classroom projectors.', 15.00, 4, 2);
    INSERT INTO tags VALUES
        ('Digital Adapters', 3);
    INSERT INTO tags VALUES
        ('Electronics', 3);
    INSERT INTO tags VALUES
        ('Projector Accessories', 3);

    ----------------------------------------------------------------------------
    INSERT INTO items (item_name, description , price, quantity, threshold) VALUES
        ('mechanical keyboard', 'typing', 19.00, 5, 2);
    INSERT INTO tags VALUES
        ('I/O device', 4);
    INSERT INTO tags VALUES
        ('Electronics', 4);

    ----------------------------------------------------------------------------
    INSERT INTO items (item_name, description , price, quantity, threshold) VALUES
        ('keyboard', 'typing', 19.00, 3, 2);
    INSERT INTO tags VALUES
        ('I/O device', 5);
    INSERT INTO tags VALUES
        ('Electronics', 5);


    -- Add some hidden items --
    ----------------------------------------------------------------------------
    INSERT INTO items (item_name, description, price, quantity, threshold, is_hidden) VALUES
        ('Poop Tarts', 'A not-so tasty snack.', 0.0, 10, 5, true);
    INSERT INTO items (item_name, description, price, quantity, threshold, is_hidden) VALUES
        ('kechanical meyboard', 'typing', 19.00, 5, 2, true);



    ----------------------------------------------------------------------------
    --the password for these 2 test users is 'cat'--
    INSERT INTO users (username, password, admin) VALUES
        ('admin', '$2a$10$X79.QYL2UnMDChg9adWRLel1w/Mn9b3GfBEL3rUdiYcA2LqaPsoaO', true);
    INSERT INTO users (username, password) VALUES
        ('user', '$2a$10$X79.QYL2UnMDChg9adWRLel1w/Mn9b3GfBEL3rUdiYcA2LqaPsoaO');


    -- Items that will be below threshold to test shopping cart --
    ----------------------------------------------------------------------------
    INSERT INTO items (item_name, description, price, quantity, threshold) VALUES
        ('Gummy Bears', 'A tasty, chewy snack.', 3.50, 5, 10);
    INSERT INTO items (item_name, description, price, quantity, threshold) VALUES
        ('Paper', '8.5x11 white printer paper.', 5.60, 5, 6);
    INSERT INTO items (item_name, description, price, quantity, threshold) VALUES
        ('Golf Balls', 'Used in a boring activity.', 1.99, 20, 25);
    INSERT INTO items (item_name, description, price, quantity, threshold) VALUES
        ('Erasers', 'For the end of a pencil', 0.50, 20, 25);
    INSERT INTO items (item_name, description, price, quantity, threshold) VALUES
        ('Pens', 'Black ink pens.', 12.99, 9, 12);



-- Perform some Transaction --

    -- lukekaz9 take 5 Pop-Tarts from the inventory --
    ----------------------------------------------------------------------------
    INSERT INTO transactions(item_id, person, qty_changed) VALUES
    (item_id_with_name('Black & White Printer Ink'), 'lukekaz9', -2);

    -- Seven P op-Tarts are added to the inventory by joeShmo. --
    ----------------------------------------------------------------------------
    INSERT INTO transactions(item_id, person, qty_changed) VALUES
    (item_id_with_name('Pop-Tarts'), 'joeShmo', 7);
