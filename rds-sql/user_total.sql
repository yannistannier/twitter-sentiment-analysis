create table user_total
(
	id varchar(255),
	positive integer,
	neutral integer,
	negative integer,
	joy integer,
	far integer,
	anger integer,
	surprise integer,
	sadness integer,
	total integer,
	username varchar(255)
)
;

create index user_total_id_index
	on user_total (id)
;
