<!-- DATABASE FOR session-->
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");


<!-- DATABASE FOR users -->
CREATE TABLE users(
	id serial primary key,
	email varchar(50) unique not null,
    type VARCHAR(45),
    name VARCHAR(70),
    lastname VARCHAR(70),
    phone_number BIGINT unique,
    password text ,
	role varchar(45) ,
    image BYTEA,
    file_mime_type TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(10),
    code_expires_at TIMESTAMP
)
SELECT pg_get_serial_sequence('users', 'id');
SELECT setval('user_id_seq', (SELECT MAX(id) FROM users));

<!-- DATABASE FOR modules -->
CREATE TABLE module_storage_section (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT, 
    tags VARCHAR(255)[], 
    created_by INTEGER not null, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    file_data BYTEA,
    file_mime_type TEXT,
    achievement_image_data BYTEA,
    achievement_image_mime_type TEXT,
    difficulty_level VARCHAR(20)
);


<!-- DATABASE FOR Units -->
CREATE TABLE module (
    id SERIAL PRIMARY KEY,
    publisher INTEGER NOT NULL,
    title TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    information TEXT NOT NULL,
    storage_section_id INTEGER NOT NULL REFERENCES module_storage_section(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
SELECT pg_get_serial_sequence('module', 'id');
SELECT setval('module_id_seq', (SELECT MAX(id) FROM module));

<!-- DATABASE FOR quiz  -->
CREATE TABLE questions (
    id SERIAL PRIMARY KEY,
    module_title INTEGER NOT NULL REFERENCES module(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SELECT pg_get_serial_sequence('questions', 'id');
SELECT setval('questions_id_seq', (SELECT MAX(id) FROM questions));

<!-- DATABASE FOR quiz scores -->
CREATE TABLE module_scores (
    id SERIAL PRIMARY KEY,                 
    user_id INTEGER NOT NULL,               
    module_id INTEGER NOT NULL,                     
    completed BOOLEAN NOT NULL,            
    score INTEGER NOT NULL DEFAULT 0,       
    passed BOOLEAN NOT NULL,                
    attempt_number INTEGER NOT NULL,        
    feedback TEXT, 
	time_spent INTEGER,
	completion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	perfect_score INTEGER,                     
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES module(id) ON DELETE CASCADE
);

SELECT pg_get_serial_sequence('users', 'id');
SELECT setval('user_id_seq', (SELECT MAX(id) FROM users));

<!-- DATABASE FOR unit completed without quiz -->
CREATE TABLE module_completion (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES module(id) ON DELETE CASCADE,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
);

<!-- DATABASE FOR jobs -->
CREATE TABLE jobs(
	id serial primary key,
	publisher varchar(45),
	name varchar(45),
	phone varchar(45),
	email varchar(45),
	title varchar(100),
	applicants INTEGER DEFAULT 0,
	remote varchar(45),
	experience varchar(100),
	jobtype varchar(45),
	salary varchar(45),
	state text,
	city text,
	street text,
	description text,
	moreInfo text,
	date date,
    update_date TIMESTAMP,
    file_name TEXT,
    file_data BYTEA,
    file_mime_type TEXT
)

CREATE TABLE job_bookmarks (
    id serial PRIMARY KEY,
    user_id int, 
    job_id int NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs (id) ON DELETE CASCADE
);

<!-- DATABASE FOR announcements -->
CREATE TABLE announcements (
	id serial primary key , 
	publisher text not null,
	title text not null,
	description text not null,
    date TIMESTAMP DEFAULT (NOW() AT TIME ZONE 'Asia/Manila')
)

<!-- DATABASE FOR applicants -->
CREATE TABLE applicants (
	id serial primary key, 
	jobId INTEGER not null,
	job_title text not null,
	fullname text not null,
	email text not null,
	application text not null,
	date date not null,
	resume BYTEA,
    file_mime_type TEXT
)


<!-- DATABASE FOR email -->
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
	is_reply BOOLEAN DEFAULT FALSE,
    title text
)



<!-- DATABASE FOR Question&Answer questions-->
CREATE TABLE QA_questions (
    question_id SERIAL PRIMARY KEY, 
    user_id INT NOT NULL,           
    question_text TEXT,    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    topic VARCHAR(300) NOT NULL,
	topic_type varchar(50) NOT NULL,         
    is_resolved BOOLEAN DEFAULT FALSE,
    image BYTEA,
    file_mime_type TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isUpdated boolean DEFAULT false,
    updated_by INTEGER
);
SELECT pg_get_serial_sequence('QA_questions', 'question_id');
SELECT setval('QA_questions_question_id_seq', (SELECT MAX(question_id) FROM QA_questions));

<!-- DATABASE FOR Question&Answer  answers-->
CREATE TABLE QA_answers (
    answer_id SERIAL PRIMARY KEY,   
    question_id INT NOT NULL REFERENCES QA_questions(question_id) ON DELETE CASCADE,
    user_id INT NOT NULL,          
    answer_text TEXT NOT NULL,      
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    is_accepted BOOLEAN DEFAULT FALSE,
    parent_answer_id INT
);

SELECT pg_get_serial_sequence('QA_answers', 'answer_id');
SELECT setval('QA_answers_answer_id_seq', (SELECT MAX(answer_id) FROM QA_answers));

<!-- DATABASE FOR Question&Answer  votes-->
CREATE TABLE QA_votes (
    vote_id SERIAL PRIMARY KEY,     
    target_id INT NOT NULL,        
    target_type VARCHAR(10) CHECK (target_type IN ('question', 'answer')), 
    user_id INT NOT NULL,           
    vote_type VARCHAR(10) CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (target_id, target_type, user_id) 
);

