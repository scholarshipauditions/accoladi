import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../shared/services/user.service';

@Component({
	selector: 'app-student',
	templateUrl: './student.component.html'
})

export class StudentComponent implements OnInit {

	showSidebar = false;
	paid: any;
	displayMessage: boolean;

	constructor(
		private authService: AuthService,
		private router: Router,
		private userService: UserService
	) { }

	ngOnInit() {
		// Why is this here?
		if (this.userService.currentUser.role === 'Teacher') {
			this.displayMessage = false;
		} 
		
		if ( this.userService.currentUser.role !== 'Student') {
			this.authService.logout();
			this.router.navigate(['/login']);
		} 

		this.userService
			.sidebarSubject
			.subscribe(
				(response: any) => {
					this.showSidebar = response === 'true';
				}
			);

		this.paid = false;
		this.userService
			.getUserAccount(
				this.userService.currentUser._id
			)
			.subscribe(
				(result: any) => {
					this.paid = result.data.meta.dates.paid_thru;
					if (new Date() < new Date(this.paid)) {
						this.displayMessage = false; // console.log('paid? = yes' );
					} else {
						if (this.userService.currentUser.role === 'Teacher') {
							this.displayMessage = false;
						} else {
							this.displayMessage = true; // console.log('paid? = No');
						}
					}
				}
			);

	}

}