create table user_stat
(
	id varchar(255),
	month integer,
	positive integer,
	neutral integer,
	negative integer,
	joy integer,
	fear integer,
	anger integer,
	surprise integer,
	sadness integer,
	total integer,
	username varchar(255)
)
;

create index user_stat_id_month_index
	on user_stat (id, month)
;
