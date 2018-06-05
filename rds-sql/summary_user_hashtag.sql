create table summary_user_hashtag
(
	id varchar(255) not null,
	username varchar(255),
	hashtag varchar(255) not null,
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

create index summary_user_hashtag_username_index
	on summary_user_hashtag (username)
;
