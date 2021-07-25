let d = new Date();
export const environment = {
	production: true,
	label: '',
	title: 'Accoladi.com',
	copywrite: '(c) 2017-' + d.getFullYear(),
	build: '20210722', //d.getFullYear().toString() + (d.getMonth()+1).toString() + ('0' + d.getDate()).slice(-2).toString() + '.' + d.getHours().toString() + d.getMinutes().toString(),
	// apiUrl: 'https://api.accoladi.com',
	// apiPath: ''
	uiUrl: 'https://www.accoladi.com',
	apiUrl: 'https://sa-members-api-prod.herokuapp.com',
	apiPath: '/api',
	stripeKey: 'pk_live_dg0m1mmvuOFgJrp81vmdp5yg00Qsq990xi'
};
