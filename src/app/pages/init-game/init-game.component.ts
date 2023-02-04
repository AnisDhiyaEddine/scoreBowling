import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { create_game, score } from 'src/functions/function';
import { Router } from '@angular/router';

@Component({
  selector: 'app-init-game',
  templateUrl: './init-game.component.html',
  styleUrls: ['./init-game.component.css'],
})
export class InitGameComponent implements OnInit {
  submitted = false;
  numPlayers: number;
  playersFormArray: FormArray;
  controller: FormGroup;
  buttonState = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.playersFormArray = this.formBuilder.array([]);
    this.updatePlayers();
    this.controller = this.formBuilder.group({
      nbTour: ['', Validators.required],
      nbQuille: ['', Validators.required],
      nbJoueur: ['', Validators.required],
      playersCheck: this.playersFormArray,
    });

    this.controller.valueChanges.subscribe(() => {
      this.buttonState = this.controller.invalid || this.validatePlayersArray();
    });
  }

  validatePlayersArray(): boolean {
    let invalid = false;
    this.playersFormArray.controls.forEach((control) => {
      if (control.value === '') {
        invalid = true;
      }
    });
    return invalid;
  }

  updatePlayers() {
    this.playersFormArray.clear();
    for (let i = 0; i < this.numPlayers; i++) {
      this.playersFormArray.push(this.formBuilder.control(''));
    }
  }

  async onSubmit() {
    this.submitted = true;
    if (this.controller.invalid) {
      console.log('invalid');
    } else {
      await create_game(
        this.controller.value.nbTour,
        this.controller.value.nbQuille,
        this.controller.value.playersCheck.map((p, index) => {
          return {
            id: index + 1,
            name: p,
            scores: <score[]>[],
          };
        })
      );
      this.router.navigate(['/in-game']);
    }
  }
}
