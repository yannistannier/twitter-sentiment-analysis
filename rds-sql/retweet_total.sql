create table retweet_total
(
	id varchar(255),
	positive integer,
	neutral integer,
	negative integer,
	joy integer,
	fear integer,
	anger integer,
	surprise integer,
	sadness integer,
	total integer,
	retweet varchar(255)
)
;

create index retweet_total_id_index
	on retweet_total (id)
;
