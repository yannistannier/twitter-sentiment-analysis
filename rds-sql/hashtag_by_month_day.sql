create table hashtag_by_month_day
(
	id integer,
	hashtag varchar(255),
	positive integer,
	neutral integer,
	negative integer,
	joy integer,
	fear integer,
	anger integer,
	surprise integer,
	sadness integer,
	total integer
)
;

create index hashtag_by_month_day_id_index
	on hashtag_by_month_day (id)
;
