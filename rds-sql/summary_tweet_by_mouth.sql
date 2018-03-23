create table summary_tweet_by_month
(
	month integer,
	day integer,
	positive integer,
	neutral integer,
	negative integer,
	joy integer,
	fear integer,
	anger integer,
	surprise integer,
	sadness integer,
	total integer,
	constraint summary_tweet_by_month_month_day_pk
		unique (month, day)
)
;
