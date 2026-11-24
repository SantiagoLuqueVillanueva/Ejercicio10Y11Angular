import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { Game } from '../models/game';
import { GameService } from '../services/game.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-crud',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css',
})
export class CrudComponent implements OnInit {
  private gameService = inject(GameService);

  games: Game[] = [];

  gameForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(40),
      ],
    }),
    genre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    platform: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0.01),
        Validators.max(100),
      ],
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(999),
        Validators.pattern(/^\d+$/),
      ],
    }),
  });

  editId?: number;

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe((data) => {
      this.games = data;
    });
  }

  onSaveGame(form: FormGroupDirective): void {
    this.gameForm.markAllAsTouched();

    if (this.gameForm.invalid) {
      return; // no se contacta con JSON Server
    }

    const game: Game = this.gameForm.getRawValue();

    if (this.editId) {
      this.gameService.updateGame({ ...game, id: this.editId }).subscribe({
        next: () => {
          this.loadGames();
          this.resetGame(form);
        },
        error: () => alert('No se pudo actualizar el videojuego'),
      });
    } else {
      this.gameService.createGame(game).subscribe({
        next: () => {
          this.loadGames();
          this.resetGame(form);
        },
        error: () => alert('No se pudo crear el videojuego'),
      });
    }
  }

  editGame(game: Game): void {
    this.editId = game.id;
    this.gameForm.patchValue(game);
  }

  cancelEdit(form: FormGroupDirective): void {
    this.resetGame(form);
  }

  private resetGame(form: FormGroupDirective): void {
    this.editId = undefined;
    form.resetForm();
  }
}
