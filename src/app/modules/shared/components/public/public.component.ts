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


	openFeaturedStudent(student) {
		this.modalService.open(student, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true })
	}

}