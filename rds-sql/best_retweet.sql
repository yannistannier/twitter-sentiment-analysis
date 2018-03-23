create table best_retweet
(
	month integer,
	retweet varchar(255),
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

create index best_retweet_month_index
	on best_retweet (month)
;
