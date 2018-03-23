create table best_user
(
	month integer,
	username varchar(255),
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

create index best_user_month_index
	on best_user (month)
;
