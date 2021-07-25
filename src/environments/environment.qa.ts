let d = new Date();
export const environment = {
	production: false,
	label: 'QA/Testing',
	title: 'Accoladi.com',
	copywrite: '(c) 2017-' + d.getFullYear(),
	build: '20210722', //d.getFullYear().toString() + (d.getMonth()+1).toString() + ('0' + d.getDate()).slice(-2).toString() + '.' + d.getHours().toString() + d.getMinutes().toString(),
	uiUrl: 'https://qa-www.accoladi.com',
	apiUrl: 'https://sa-members-api-qa.herokuapp.com',
	apiPath: '/api',
	stripeKey: 'pk_test_HVjpUsglKB3zCbRyCD1MXyZM00e9h1tEjq'
};