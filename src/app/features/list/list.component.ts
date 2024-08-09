import { Product } from './../../shared/interfaces/product.interface';
import { ProductsService } from './../../shared/services/products.service';
import { Component, inject, signal } from '@angular/core';
import { CardComponent } from './components/card/card.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';
import { ComfirmationDialogService } from '../../shared/services/comfirmation-dialog.service';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CardComponent, RouterLink, MatButtonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  products = signal<Product[]>(inject(ActivatedRoute).snapshot.data['products']);

  productsService = inject(ProductsService);
  router = inject(Router);
  comfirmationDialogService = inject(ComfirmationDialogService);

  onEdit(product: Product) {
    this.router.navigate(['/edit-product', product.id]);
  }

  onDelete(product: Product) {
    this.comfirmationDialogService
      .openDialog()
      .pipe(filter((answer) => answer === true))
      .subscribe(() => {
        this.productsService.delete(product.id).subscribe(() => {
          this.productsService.getAll().subscribe((products) => {
            this.products.set(products);
          });
        });
      });
  }
}
