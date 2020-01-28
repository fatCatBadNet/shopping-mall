export function TimeDifference(){
	const startDate = new Date();
    const endDate = new Date();
    const dateArr = [];
    startDate.setDate(endDate.getDate() - 30);
    const 	s_y = startDate.getFullYear(),
    		s_m = startDate.getMonth() + 1 < 10 ? '0'+ (startDate.getMonth()+1) : startDate.getMonth() + 1,
    		s_d = startDate.getDate() < 10 ? '0' + startDate.getDate() : startDate.getDate(),
   			start_D = s_y + '-' + s_m + '-' + s_d;
   	dateArr.push(start_D);
   	const 	e_y = endDate.getFullYear(),
    		e_m = endDate.getMonth() + 1 < 10 ? '0'+ (endDate.getMonth()+1) : endDate.getMonth() + 1,
    		e_d = endDate.getDate() < 10 ? '0' + endDate.getDate() : endDate.getDate(),
   			end_D = e_y + '-' + e_m + '-' + e_d;
   	dateArr.push(end_D);
	return dateArr;
}