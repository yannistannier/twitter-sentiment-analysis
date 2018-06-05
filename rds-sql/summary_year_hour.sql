create table summary_year_hour
(
	id integer,
	type varchar(100),
	positive integer,
	neutral integer,
	negative integer,
	joy integer,
	fear integer,
	anger integer,
	sadness integer,
	surprise integer,
	total integer,
	constraint summary_year_hour_id_type_pk
		unique (id, type)
)
;
