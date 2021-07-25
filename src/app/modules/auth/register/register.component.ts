import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { RegisterModel } from '../models/register.model';
import { UserService } from '../../shared/shared.module';
import { AuthService } from '../auth.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

	model = new RegisterModel();

	form: FormGroup;
	roles: string[];
	agent: string;
	errorMessage: string;
	invite = '';
	selectedRole = '';
	promo_code = '';
	type: any = 'Parent';
	email: any;
	showRole: any;
	queryRole: any;
	queryEmail: any;
	childData: any;
	studentId: any;
	role: any;
	userId: any;
	agreed: boolean = true;
	ShowPersonalInfo: boolean = true;
	submitAttempted: boolean = false;
	loading: boolean = false;
	registerSuccess: boolean = false;
	registerFailed: boolean = false;
	searchingColleges: boolean = false;
	searchFailed: boolean = false;
	requireCCforSignup = false;
	emailChanged: boolean = false;
	ErrorAlert: boolean = false;
	ShowAccountInfo: boolean = false;
	ShowLocationInfo: boolean = false;
	ShowTalentInfo: boolean = false;
	ShowParentInfo: boolean = false;
	ShowSchoolInfo: boolean = false;
	ShowCouponCode: boolean = false;

	constructor(
		private authService: AuthService,
		private router: Router,
		private userService: UserService,
		public activatedRoute: ActivatedRoute,
		public activeModal: NgbActiveModal,
	) {
		this.form = new FormGroup(
			{
				email: new FormControl( '', [Validators.required, Validators.email] ),
				role: new FormControl( '', [Validators.required] ),
				agree: new FormControl( '' ),
				agent: new FormControl( '' ),
				promo_code: new FormControl( '' ),
				school_id: new FormControl( '' ),
				soar_id: new FormControl( '' )
			}
		);

		this.roles = ['Parent', 'Student', 'Teacher', 'Recruiter'];
	}

	ngOnInit() { console.log('onInit...');

		this.activatedRoute
			.queryParams
			.subscribe(
				params => {
					this.queryRole = params['role'];
					this.queryEmail = params['email'];
				}
			);

		if (this.queryRole != undefined && this.queryEmail != undefined) {
			this.form.get('email').setValue(this.queryEmail);
			this.form.get('role').setValue(this.queryRole)
			this.selectedRole = this.queryRole;
			this.userService
				.checkEmailNotTaken(
					this.queryEmail
				)
				.subscribe(
					(data: any) => {
						if (data.message == 'User found') {
							this.ErrorAlert = true;
							this.errorMessage = 'A user with that email address already exists'
							this.emailChanged = false;
						} else if (data.message == 'No such email exists in system') {
							localStorage.setItem('mailaddress', this.queryEmail);
							this.register()
							this.ErrorAlert = false;
							this.emailChanged = true;
						}
					},
					err => { }
				);
		}

		this.activatedRoute
			.params
			.subscribe(
				params => {
					this.userId = localStorage.getItem('userId');
					this.role = params['role'];
					this.showRole = this.role
				}
			);

		this.form.get('role').valueChanges.subscribe(val => {
			//this.role = val;
			this.selectedRole = val;
			if (val !== 'Recruiter') {
				this.agreed = true;
			}
		});

		this.agreed = this.form.get('role').value === 'Recruiter' && this.form.get('agree').value;

		this.form.get('agree').valueChanges.subscribe(val => {
			if (val) {
				this.agreed = this.form.get('role').value === 'Recruiter';
			} else {
				this.agreed = false;
			}
		});

		this.activatedRoute
			.queryParams
			.subscribe(
				(params: Params) => {
					if (params.inv) {
						this.invite = params['inv'];
					}

					if (params.agent) {
						this.form.get('agent').setValue(params['agent']);
						this.form.get('agent').disable();
					}

					if (params.p) {
						this.form.get('promo_code').setValue(params['p']);
						this.form.get('promo_code').disable();
					}

					if (params.s) {
						this.form.get('school_id').setValue(params['s']);
					}

					if (params.soar) {
						this.form.get('soar_id').setValue(params['soar']);
					}
				}
			);

		if (this.authService.isLoggedIn()) {
			this.router.navigate([
				this.userService.currentUser.role.toLowerCase()
			]);
		}

		this.activatedRoute
			.params
			.subscribe(
				(params: Params) => {
					if (params['promo']) {
						this.form.get('promo_code').setValue(params['promo']);
						this.form.get('promo_code').disable();
					}

					if (
						params['role'] &&
						this.roles
							.map(role => role.toLowerCase())
							.includes(params['role'].toLowerCase())
					) {
						let role = params['role'];
						role = role[0].toUpperCase() + role.slice(1);
						this.form.get('role').setValue(role);
						this.form.get('role').disable();
					}
				}
			);

	}

	get f() { console.log('get f...');
		return this.form.controls;
	}

	get basicInfoModel() { console.log('get basicInfoModel...');
		let mail = localStorage.getItem('mailaddress')
		let register: any = {
			username: mail.substring(0, mail.indexOf('@')),
			email: mail,
			role: this.selectedRole,
			promo_code: this.form.get('promo_code').value,
		};
		return register;
	}

	selectRole(role) { console.log('selectRole...',role);
		this.selectedRole = role;
		this.ErrorAlert = false;
	}

	signUp() { console.log('signup...');
		if (this.form.valid) {
			this.onEmailChange(this.form.get('email').value)
		} else {
			this.validateAllFormFields(this.form);
			this.loading = false;
			this.submitAttempted = false;
		}
	}

	register() { console.log('register...');
		if (!this.loading) {
			this.loading = true;
			if (this.form.valid) {

				this.authService
					.register(
						this.basicInfoModel
					)
					.subscribe( 
						(data: any) => {
							if (data.message == 'Registration Succeeded') {
								this.userId = data.data.userId;
								localStorage.setItem('userId', this.userId);
								this.loading = false;
								this.registerSuccess = true;
								return this.router.navigate(['/register/' + this.selectedRole]);
							}
						},
						err => {
							if (err.error.message.includes('duplicate key')) {
								this.ErrorAlert = true;
								this.errorMessage = 'This email is already taken'
							}
							this.loading = false;
							this.registerFailed = true;
						}
					);
			} else {
				this.validateAllFormFields(this.form);
				this.loading = false;
				this.submitAttempted = false;
			}
		}

	}

	validateAllFormFields(formGroup: FormGroup) { console.log('validateAllFormFields...',formGroup);
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	isFieldInvalid(fieldName: string) { console.log('isFieldInvalid...',fieldName);
		const field = this.form.get(fieldName);
		if (field == null) {
		}
		return field.invalid && (field.touched || this.submitAttempted);
	}

	onKeyup(mail) { console.log('onKeyup...',mail);
		this.form.get('email').setValue(mail)
		this.ErrorAlert = false;
	}

	onEmailChange(mailAddress: string): void { console.log('onEmailChange...',mailAddress);
		if (this.selectedRole != null && this.selectedRole != undefined) {
			this.userService
				.checkEmailNotTaken(
					mailAddress
				)
				.subscribe(
					(data: any) => {
						if (data.message == 'User found') {
							this.ErrorAlert = true;
							this.errorMessage = 'A user with that email address already exists'
							this.emailChanged = false;
						} else if (data.message == 'No such email exists in system') {
							localStorage.setItem('mailaddress', mailAddress);
							this.register()
							this.ErrorAlert = false;
							this.emailChanged = true;
						}
					},
					err => { }
				);
		} else {
			this.ErrorAlert = true;
			this.errorMessage = 'Please select a role of student or parent, etc.'
		}

	}

	onSaveWizard(event) { console.log('onSaveWizard...',event.btnType,event.role,event.message);
		this.userId = event.user_Id;
		if (event.btnType == 'Continue') {

			if (event.message == 'PersonalInfoSuccess') {
			
				if (event.role == 'Student' || event.role == 'Teacher' || event.role == 'Recruiter') {
					this.ShowPersonalInfo = false;
					this.ShowAccountInfo = true;
				} else if (event.role == 'Parent' && event.type == 'Parent') {
					this.ShowPersonalInfo = false;
					this.ShowAccountInfo = true;
				} else if (event.role == 'Parent' && event.type == 'Child') {
					this.childData = event.childData;
					this.ShowPersonalInfo = false;
					this.ShowAccountInfo = true;
				}
			
			} else if (event.message == 'AccountInfoSuccess') {
			
				if (event.role == 'Student' || event.role == 'Teacher' || event.role == 'Recruiter') {
					this.ShowAccountInfo = false;
					this.ShowLocationInfo = true;
				} else if (event.role == 'Parent' && event.type == 'Parent') {
					this.ShowAccountInfo = false;
					this.ShowLocationInfo = true;
				} else if (event.role == 'Parent' && event.type == 'Child') {
					this.childData = event.childData;
					this.userId = event.student_id;
					this.ShowAccountInfo = false;
					this.ShowTalentInfo = true;
				}
			
			} else if (event.message == 'LocationInfoSuccess') {
			
				if (event.role == 'Teacher' || event.role == 'Recruiter') {
					this.ShowLocationInfo = false;
					this.ShowSchoolInfo = true;
				} else if (event.role == 'Student') {
					this.ShowLocationInfo = false;
					this.ShowTalentInfo = true;
				} else if (event.role == 'Parent' && event.type == 'Parent') {
					this.type = 'Child'
					this.ShowLocationInfo = false;
					this.ShowPersonalInfo = true;
				}
			
			} else if (event.message == 'TalentInfoSuccess') {
			
				this.ShowTalentInfo = false;
				this.ShowSchoolInfo = true;
			
			} else if (event.message == 'SchoolInfoSuccess') {
			
				if (event.role == 'Teacher' || event.role == 'Parent') {
					this.redirectLogin()
				} else if (event.role == 'Recruiter') {
					this.redirectLogin()
				} else {
					this.ShowSchoolInfo = false;
					this.ShowParentInfo = true;
				}
			
			} else if (event.message == 'ParentInfoSuccess') {
			
				this.redirectLogin()
			
			} else if (event.message == 'CouponCodeSuccess') {
			
				this.redirectLogin()
			}

		} else if (event.btnType == 'Back') {
			
			if (event.message == 'BackAccountInfor') {
				this.ShowPersonalInfo = true;
				this.ShowAccountInfo = false;
			} else if (event.message == 'BackLocationInfor') {
				this.ShowAccountInfo = true;
				this.ShowLocationInfo = false;
			} else if (event.message == 'BackTalentInfor') {
				if (event.role == 'Parent') {
					this.childData = event.childData;
					this.ShowTalentInfo = false;
					this.ShowAccountInfo = true;
				} else {
					this.ShowTalentInfo = false;
					this.ShowLocationInfo = true;
				}
			} else if (event.message == 'BackSchoolInfor') {
				if (event.role == 'Student') {
					this.ShowTalentInfo = true;
					this.ShowSchoolInfo = false;
				} else if (event.role == 'Teacher') {
					this.ShowSchoolInfo = false;
					this.ShowLocationInfo = true;
				} else if (event.role == 'Recruiter') {
					this.ShowSchoolInfo = false;
					this.ShowLocationInfo = true;
				} else if (event.role == 'Parent') {
					this.ShowSchoolInfo = false;
					this.ShowTalentInfo = true;
				}
			} else if (event.message == 'BackParentInfor') {
				if (event.role == 'Student') {
					this.ShowParentInfo = false;
					this.ShowSchoolInfo = true;
				}
			} else if (event.message == 'BackPersonalInfor') {
				this.type = event.type;
				this.ShowPersonalInfo = false;
				this.ShowLocationInfo = true;
			}

		}
	}

	redirectLogin() { console.log('redirectLogin...');
		localStorage.clear();
		return this.router.navigate(['/login']);
	}

}