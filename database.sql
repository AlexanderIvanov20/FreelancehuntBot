--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    name character varying(300) NOT NULL,
    description character varying(3000) NOT NULL,
    amount integer NOT NULL,
    currency character varying(5) NOT NULL,
    link character varying(200) NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    skill_id integer[],
    skill_name text[],
    project_id integer NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.projects_id_seq OWNER TO postgres;

--
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    user_id integer NOT NULL,
    username character varying(40) NOT NULL,
    ids integer[] NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (id, name, description, amount, currency, link, first_name, last_name, skill_id, skill_name, project_id) FROM stdin;
14	Телеграм бот на python	bot на python для телеграмма сделать бота чтобы он использовал апи сайта (как реферальную) и производил покупку в телеграм боте с наценкой\nаренда номеров\nактивация сервисов разовым и повторным приемом смс	-1	-1	https://freelancehunt.com/project/telegram-bot-na-python/704884.html	Gagik	S.	{22,180}	{Python,"Разработка ботов"}	704884
15	Нужен чеккер на наличие Вайбера по номеру телефона.	-Обязательно в декстоп версии.\n -Номера в формате 380**** ( без + )\n -Загрузка в формате .txt номера через строку.\n -Выгрузка обязательно должна быть в двух файлах .txt ( с наличием вайбера на номере и без наличия вайбера ) .\n -Многопоточность ( как минимум 10 потоков ) .\n -Поддержка прокси\n- скорость потока должна быть минимум 1000 номеров в час.\nТак же, может быть рассмотрю готовые решения за адекватный прайс.	2500	UAH	https://freelancehunt.com/project/nuzhen-chekker-na-nalichie-vaybera-po/704865.html	Егор	Е.	{24,22}	{C#,Python}	704865
16	Автоматический перехват кода авторизации для создания токена Ebay API	Здравствуйте.\nЭто часть проекта https://freelancehunt.com/project/ebay-api/698134.html, которую не получилось реализовать.\n\n\n"Скрипт должен работать самостоятельно, без VPS, VPC, конфигурации портов маршрутизатора или какого-либо доступа к внешней «обработке», - перехватывать код авторизации для создания токенов.\nМожно использовать страницу PHP для отдачи URL для кода авторизации или любой другой способ и язык програмирования, работающий на Linux.	-1	-1	https://freelancehunt.com/project/avtomaticheskiy-perehvat-koda-avtorizatsii-dlya-sozdaniya/704825.html	Олександр	Л.	{174,1}	{Node.js,PHP}	704825
17	Настроить Push Notification для PWA приложения	Настроить Push Notification с FireBase для PWA приложения.\nПодключить push manager, сбор и рассылку пушей с FireBase.\nПример настройки - https://www.codemag.com/Article/1901031/Implementing-Push-Notifications-in-Progressive-Web-Apps-PWAs-Using-Firebase	-1	-1	https://freelancehunt.com/project/nastroit-push-notification-dlya-pwa-prilozheniya/704765.html	Max	E.	{28,174}	{Javascript,Node.js}	704765
18	Обработка документов DOC и DOCX на php или python	Необходимо очищать разделы тексты в документах\n\n\n1. Удалить всё начало документа (до слова Abstract)\nhttps://prnt.sc/t3q4x7\n\n\n2. Раздел Authors внизу документов. Как найти данный раздел - по жирному слову Authors \nhttps://prnt.sc/t3q5ei\n\n\n3. Необходимо будет добавить в документ такой нумерованный список с квадратными скобками\nhttps://prnt.sc/t3q66o	-1	-1	https://freelancehunt.com/project/obrabotka-dokumentov-doc-docx-na/704743.html	Светлана	Б.	{1,22}	{PHP,Python}	704743
19	Капча парсинг	В готовом боте нужно сделать обход капчи который выложен на Сайт\nДобавить команду из страницы которая выдаёт last ip и бот выдаёт информацию об ip адреса с сайта.\nЧтобы именно это команда работала в беседах в лс нет.	-1	-1	https://freelancehunt.com/project/kapcha-parsing/704719.html	Юрий	Б.	{22,180}	{Python,"Разработка ботов"}	704719
20	React & Redux	Здравствуйте!\n\nИщем программиста на JavaScript с опытом работы React & Redux, для написания админ-панели.\nОпыт работы с данными фреймворками от 1 года\nRESTFull Api уже есть\n\nКого интересует долгосрочное сотрудничество оставляем свои контакты и цену за час работы!	-1	-1	https://freelancehunt.com/project/react-redux/704570.html	Bogdan	P.	{28,174}	{Javascript,Node.js}	704570
21	Python developer	Ищем Python программиста для помощи в переносе существующего веб-сервиса на Python. Есть живой интерфейс и функционал, плюс несколько фич которые надо будет учесть при планировании архитектуры (желательно иметь подобный опыт).\nЗагрузка до трёх дней в неделю, работа на несколько месяцев. Работаем удалённо, связь через чат в мессенджерах/голосом. Тикеты в Trello, используем простой Git flow.\n\n\nТребованияОпыт в web, SaaS, Python for webОпыт с Linux серверамиDocker (желательно, не обязательно, решение об использовании будем принимать позже)Хороший уровень front-end	-1	-1	https://freelancehunt.com/project/python-developer/704521.html	Igor	G.	{22,99}	{Python,Веб-программирование}	704521
22	Задача по теории вероятностей (матрицы, цепи Маркова, казино)	Если играем например в казино и делаем ставку путём рандомного подбрасывания монеты, то получим проигрыш\n\n\nНо если сделать переключение между двумя проигрышными играми, то математически доказано, что можно получить выигрыш\n\n\nКак именно описано в лекции:\nhttps://youtu.be/Sh1-T6HfmZY\n\n\nПомогу с переводом\n\n\nРезультат решения задачи показан на 37-38 минуте (растущий график)\n\n\nНеобходимо закодить этот алгоритм чтобы получить примерно такой же график	-1	-1	https://freelancehunt.com/project/zadacha-po-teorii-veroyatnostey-matritsyi-tsepi/704343.html	Роман	П.	{1,22}	{PHP,Python}	704343
23	Сделать скрипт	Написать программу на питоне по созданию и настройке рекламного кабинета,\nприкрепления банковских карт, запуску рекламной компании. Так называемый парсер\nдолжен работать не используюя теги на разметки страницы, а исходя из датасета\nскриншотов и распознавании текста и полей для ввода. Если при переборе\nпрограмма не находит нужный скрин, тогда отправляет на админку модератору для\nуточненения инструкций на этом окне. Положение и движение курсора мыши при этом\nсделать максимально точным, целенаправленным и векторным, без рандомных\nдействий.\nПрограмма будет запущена на удаленных компьютерах. Количество скриншотов по\nнастройке, естественно, ограничено, но разрешение мониторов на удаленных\nрабочих станциях может отличатся, также, все формы, цвета и дизайн фейсбука\nвезде одинаковый.\nПример-инструкция работы программы:\n- распознать значек браузера на рабочем столе, кликнуть дважды, запуская;\n- подождать момента открытия приложения, ввести в адресную строку facebook.com;\n- авторизироваться;\n- создать рекламный кабинет;\n- прикрепить карту;\n- запустить рекламу на заранее определенный лендинг;\n- подождать и определить реклама была одобрена или нет, если нет, то использовать\nдругую;\nТакже надо учесть такие параметры, например, как:\n- разное время отклика из-за разницы в скорости интернета на ВНЦ и мощностей\nкомпьютера;\n- разное разрешение дисплеев;\n- дополнительное время ожидания проверки рекламной компании;\nГайд как создать и настроить РК есть по ссылке:\nhttps :/ / www . ecwid . ru / blog / guide - to - advertising - facebook . htm l\nЧасть готового уже https://yadi.sk/d/Si6pBaqZAT1egQ\nЖду от вас вопросы, комментарии по тому как год уже написан и т.д.	-1	-1	https://freelancehunt.com/project/sdelat-skript/704336.html	Roman	M.	{22}	{Python}	704336
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, user_id, username, ids) FROM stdin;
17	1118871102	AlexanderIvanov50	{88,165,129}
\.


--
-- Name: projects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_id_seq', 23, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 17, true);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: users users_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_id_key UNIQUE (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

