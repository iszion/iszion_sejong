insert into db_sej.MAGENTTB 

select  
right(comm_cd, 4),
comm_nm,
DATE_FORMAT(`REG_DATE`, '%Y%m%d'),
'99991231',
'',
reg_date,
reg_id,
update_date,
update_id
from db_sejong.MCOMMTB where left(comm_cd, 4) = '1202';
