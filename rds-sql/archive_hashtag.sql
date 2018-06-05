create table archive_hashtag
(
	id bigint,
	hashtag varchar(255),
	positive integer,
	neutral integer,
	negative integer,
	joy integer,
	fear integer,
	anger integer,
	surprise integer,
	sadness integer,
	date_month integer,
	date_day integer,
	date_hour integer,
	date_tweet timestamp,
	author varchar(255),
	retweet varchar(255)
)
;
