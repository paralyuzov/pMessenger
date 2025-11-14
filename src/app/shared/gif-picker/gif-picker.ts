import { Component, DestroyRef, inject, OnInit, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GifService } from '../../core/services/gif.service';
import { Gif } from '../../models/Gif';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-gif-picker',
  imports: [FormsModule],
  templateUrl: './gif-picker.html',
  styleUrl: './gif-picker.css',
})
export class GifPicker implements OnInit {
  private readonly gifService = inject(GifService);
  private readonly destroyRef = inject(DestroyRef);
  gifs = signal<Gif[]>([]);
  searchQuery = '';
  private searchInput$ = new Subject<string>();
  selectedGif = output<Gif>();
  closePicker = output<void>();

  ngOnInit() {
    this.loadTrendingGifs();
    this.searchInput$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((query) => {
        this.gifService.searchGifs(query).subscribe({
          next: (response) => {
            this.gifs.set(response.data);
          },
          error: (error) => {
            console.error('Error searching GIFs:', error);
          },
        });
      });
  }

  private loadTrendingGifs() {
    this.gifService.getTrendingGifs().subscribe({
      next: (response) => {
        this.gifs.set(response.data);
      },
      error: (error) => {
        console.error('Error fetching trending GIFs:', error);
      },
    });
  }

  onSearchQueryChange() {
    if (this.searchQuery.trim() === '') {
      this.loadTrendingGifs();
      return;
    }
    this.searchInput$.next(this.searchQuery.trim());
  }

  selectGif(gif: Gif) {
    this.selectedGif.emit(gif);
  }

  closeGifPicker() {
    this.closePicker.emit();
  }
}
