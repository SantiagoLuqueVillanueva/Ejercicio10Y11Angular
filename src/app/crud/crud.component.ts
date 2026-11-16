import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Game } from '../models/game';
import { GameService } from '../services/game.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-crud',
  imports: [FormsModule, JsonPipe],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css'
})
export class CrudComponent implements OnInit {

  private gameService = inject(GameService);

  games: Game[] = [];

  game: Game = {
    title: '',
    genre: '',
    platform: '',
    price: 0,
    stock: 0
  };

  ngOnInit(): void {
    this.loadGames();
  }

  loadGames(): void {
    this.gameService.getGames().subscribe(data => {
      this.games = data;
    });
  }

  onSaveGame(form: NgForm) {

  if (form.invalid) {
    return;
  }

  if (this.game.id) {
    this.gameService.updateGame(this.game).subscribe(() => {
      this.loadGames();
      this.resetGame(form);
    });
  } else {
    this.gameService.createGame(this.game).subscribe(() => {
      this.loadGames();
      this.resetGame(form);
    });
  }
}

editGame(game: Game): void {
  this.game = { ...game };
}

cancelEdit(form: NgForm): void {
  this.resetGame(form);
}

private resetGame(form: NgForm): void {
  this.game = { title: '', genre: '', platform: '', price: 0, stock: 0 };
  form.resetForm(this.game);
}
}
