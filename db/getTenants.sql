select * from users join unit_table on users.unit_id = unit_table.id where unit_table.manager = $1 order by users.id;