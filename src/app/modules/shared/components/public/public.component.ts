import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
	selector: 'app-public',
	templateUrl: './public.component.html',
	styleUrls: ['./public.component.css']
})

export class PublicComponent {

	constructor(
		private modalService: NgbModal
	) { }


	openFeaturedStudent1(student) {
		this.modalService.open(student, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openFeaturedStudent2(student) {
		this.modalService.open(student, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openFeaturedStudent3(student) {
		this.modalService.open(student, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openFeaturedSchool(school) {
		this.modalService.open(school, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

	openFeaturedProgram(program) {
		this.modalService.open(program, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true });
	}

}