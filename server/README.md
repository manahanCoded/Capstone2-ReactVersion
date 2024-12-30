DATABSE FOR users
CREATE TABLE users(
	id serial primary key,
	email varchar(50) unique not null,
    password text not null,
	role varchar(45) not null
)

DATABSE FOR modules
CREATE TABLE module (
	id serial primary key,
	title varchar(100) UNIQUE not null,
	description text not null,
	information text not null
)

DATABSE FOR quiz 
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    module_title TEXT,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DATABSE FOR quiz scores
CREATE TABLE module_scores (
    id SERIAL PRIMARY KEY,                 
    user_id INTEGER NOT NULL,               
    module_id INTEGER NOT NULL,             
    question_id INTEGER NOT NULL,          
    completed BOOLEAN NOT NULL,            
    score INTEGER NOT NULL DEFAULT 0,       
    passed BOOLEAN NOT NULL,                
    attempt_number INTEGER NOT NULL,        
    feedback TEXT,  
	prefect_score INTEGER,                     
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES module(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

DATABSE FOR jobs
CREATE TABLE jobs(
	id serial primary key,
	publisher varchar(45),
	name varchar(45),
	phone varchar(45),
	email varchar(45),
	title varchar(100),
	applicants varchar(15),
	remote varchar(45),
	experience varchar(100),
	jobtype varchar(45),
	salary varchar(45),
	state text,
	city text,
	street text,
	description text,
	moreInfo test,
	date date
)

CREATE TABLE announcements (
	id serial primary key , 
	publisher: text not null,
	title text not null,
	description text not null,
	date date not null
)

CREATE TABLE applicants (
	id serial primary key, 
	jobId INTEGER not null,
	job_title text not null,
	fullname text not null,
	email text not null,
	application text not null,
	date date not null,
	resume text not null
)

CREATE TABLE mail (
	id serial primary key,
	parent_id INT REFERENCES mail(id) ON DELETE CASCADE,
	jobTitle text,
	admin varchar(255) not null,
	aplicant_name varchar(255) not null, 
	aplicant_email varchar(255),
	reply text not null,
	type varchar(45),
	date date,
	is_reply BOOLEAN DEFAULT FALSE  
)
