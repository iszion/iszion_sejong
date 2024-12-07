create table db_sejong.XDOCATB like db_renew.XDOCATB;
create table db_sejong.XDOCBTB like db_renew.XDOCBTB;
create table db_sejong.XDOCUTB like db_renew.XDOCUTB;
create table db_sejong.XEVENTTB like db_renew.XEVENTTB;
create table db_sejong.XGRNTGTB like db_renew.XGRNTGTB;
create table db_sejong.XGRNTPTB like db_renew.XGRNTPTB;
create table db_sejong.XMENUTB like db_renew.XMENUTB;
create table db_sejong.XMFAVTB like db_renew.XMFAVTB;
create table db_sejong.MSALESTB like db_renew.MSALESTB;
create table db_sejong.MCOMMTB like db_renew.MCOMMTB;

insert into db_sejong.XMENUTB select * from db_renew.XMENUTB where location = 'sys';
insert into db_sejong.MCOMMTB select * from db_renew.MCOMMTB;


insert into db_sejong.MCOMMTB 
(COMM_CD, COMM_NM, COMM_ETC, EXPLAINS, USE_YN, REG_DATE, REG_ID, UPDATE_DATE, UPDATE_ID)
select  CONCAT('501', RIGHT(COMM_CD,4))
      , COMM_NM
      , COMM_ETC
      , EXPLAINS
      , USE_YN
      , REG_DATE
      , REG_ID
      , UPDATE_DATE
      , UPDATE_ID
      from db_sejong.MCOMMTB_BACK where LEFT(COMM_CD, 4) = '2101';
