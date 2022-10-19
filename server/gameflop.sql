--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5
-- Dumped by pg_dump version 14.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: reviewstatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.reviewstatus AS ENUM (
    'pending',
    'published',
    'rejected'
);


ALTER TYPE public.reviewstatus OWNER TO gfp;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: accounts; Type: TABLE; Schema: public; Owner: gfp
--

CREATE TABLE public.accounts (
    account_id integer NOT NULL,
    email character varying NOT NULL,
    password character varying,
    social_media jsonb,
    last_access json
);


ALTER TABLE public.accounts OWNER TO gfp;

--
-- Name: accounts_account_id_seq; Type: SEQUENCE; Schema: public; Owner: gfp
--

ALTER TABLE public.accounts ALTER COLUMN account_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.accounts_account_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: companies; Type: TABLE; Schema: public; Owner: gfp
--

CREATE TABLE public.companies (
    comp_id integer NOT NULL,
    account_id integer NOT NULL,
    name character varying(70) NOT NULL,
    logo character varying,
    verified boolean DEFAULT false NOT NULL,
    employees jsonb[]
);


ALTER TABLE public.companies OWNER TO gfp;

--
-- Name: companies_comp_id_seq; Type: SEQUENCE; Schema: public; Owner: gfp
--

ALTER TABLE public.companies ALTER COLUMN comp_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.companies_comp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: developers; Type: TABLE; Schema: public; Owner: gfp
--

CREATE TABLE public.developers (
    dev_id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.developers OWNER TO gfp;

--
-- Name: developers_dev_id_seq; Type: SEQUENCE; Schema: public; Owner: gfp
--

ALTER TABLE public.developers ALTER COLUMN dev_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.developers_dev_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: games; Type: TABLE; Schema: public; Owner: gfp
--

CREATE TABLE public.games (
    game_id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    genre character varying[] NOT NULL,
    age_rating character varying NOT NULL,
    publisher integer NOT NULL,
    developer integer NOT NULL,
    platform character varying[] NOT NULL,
    release_date date NOT NULL,
    thumbnail character varying,
    media character varying[]
);


ALTER TABLE public.games OWNER TO gfp;

--
-- Name: games_game_id_seq; Type: SEQUENCE; Schema: public; Owner: gfp
--

ALTER TABLE public.games ALTER COLUMN game_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.games_game_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: publishers; Type: TABLE; Schema: public; Owner: gfp
--

CREATE TABLE public.publishers (
    pub_id integer NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.publishers OWNER TO gfp;

--
-- Name: publishers_pub_id_seq; Type: SEQUENCE; Schema: public; Owner: gfp
--

ALTER TABLE public.publishers ALTER COLUMN pub_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.publishers_pub_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: gfp
--

CREATE TABLE public.reviews (
    review_id integer NOT NULL,
    author integer NOT NULL,
    game integer NOT NULL,
    rating integer NOT NULL,
    title character varying,
    description character varying,
    likes integer DEFAULT 0,
    status public.reviewstatus DEFAULT 'pending'::public.reviewstatus NOT NULL
);


ALTER TABLE public.reviews OWNER TO gfp;

--
-- Name: reviews_review_id_seq; Type: SEQUENCE; Schema: public; Owner: gfp
--

ALTER TABLE public.reviews ALTER COLUMN review_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.reviews_review_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: gfp
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    account_id integer NOT NULL,
    name character varying(70) NOT NULL,
    photo character varying,
    linked_accounts jsonb,
    badges character varying[],
    favorite_list integer[]
);


ALTER TABLE public.users OWNER TO gfp;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: gfp
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: accounts; Type: TABLE DATA; Schema: public; Owner: gfp
--

COPY public.accounts (account_id, email, password, social_media, last_access) FROM stdin;
1	rodrigo.daniel.cortereal@policiapenal.com	\N	\N	\N
\.


--
-- Data for Name: companies; Type: TABLE DATA; Schema: public; Owner: gfp
--

COPY public.companies (comp_id, account_id, name, logo, verified, employees) FROM stdin;
\.


--
-- Data for Name: developers; Type: TABLE DATA; Schema: public; Owner: gfp
--

COPY public.developers (dev_id, name) FROM stdin;
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: gfp
--

COPY public.games (game_id, title, slug, genre, age_rating, publisher, developer, platform, release_date, thumbnail, media) FROM stdin;
\.


--
-- Data for Name: publishers; Type: TABLE DATA; Schema: public; Owner: gfp
--

COPY public.publishers (pub_id, name) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: gfp
--

COPY public.reviews (review_id, author, game, rating, title, description, likes, status) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: gfp
--

COPY public.users (user_id, account_id, name, photo, linked_accounts, badges, favorite_list) FROM stdin;
\.


--
-- Name: accounts_account_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gfp
--

SELECT pg_catalog.setval('public.accounts_account_id_seq', 1, true);


--
-- Name: companies_comp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gfp
--

SELECT pg_catalog.setval('public.companies_comp_id_seq', 1, false);


--
-- Name: developers_dev_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gfp
--

SELECT pg_catalog.setval('public.developers_dev_id_seq', 1, false);


--
-- Name: games_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gfp
--

SELECT pg_catalog.setval('public.games_game_id_seq', 1, false);


--
-- Name: publishers_pub_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gfp
--

SELECT pg_catalog.setval('public.publishers_pub_id_seq', 1, false);


--
-- Name: reviews_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gfp
--

SELECT pg_catalog.setval('public.reviews_review_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gfp
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- Name: accounts accounts_email_key; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_email_key UNIQUE (email);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (account_id);


--
-- Name: companies companies_account_id_key; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_account_id_key UNIQUE (account_id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (comp_id);


--
-- Name: developers developers_pkey; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.developers
    ADD CONSTRAINT developers_pkey PRIMARY KEY (dev_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- Name: publishers publishers_pkey; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.publishers
    ADD CONSTRAINT publishers_pkey PRIMARY KEY (pub_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (review_id);


--
-- Name: users users_account_id_key; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_account_id_key UNIQUE (account_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: companies fk_comp_account; Type: FK CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT fk_comp_account FOREIGN KEY (account_id) REFERENCES public.accounts(account_id);


--
-- Name: games fk_game_dev; Type: FK CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT fk_game_dev FOREIGN KEY (developer) REFERENCES public.developers(dev_id);


--
-- Name: games fk_game_pub; Type: FK CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT fk_game_pub FOREIGN KEY (publisher) REFERENCES public.publishers(pub_id);


--
-- Name: reviews fk_game_review; Type: FK CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_game_review FOREIGN KEY (game) REFERENCES public.games(game_id);


--
-- Name: users fk_user_account; Type: FK CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk_user_account FOREIGN KEY (account_id) REFERENCES public.accounts(account_id);


--
-- Name: reviews fk_user_author; Type: FK CONSTRAINT; Schema: public; Owner: gfp
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_user_author FOREIGN KEY (author) REFERENCES public.users(user_id);


--
-- PostgreSQL database dump complete
--

