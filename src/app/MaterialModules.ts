import { NgModule } from '@angular/core';
import { MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatDatepickerModule,
    MatTabsModule,
    MatSidenavModule } from '@angular/material';
import {MatDialogModule } from '@angular/material/dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatMenuModule} from '@angular/material/menu';

@NgModule({
    imports: [
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatDatepickerModule,
        MatDialogModule,
        MatToolbarModule,
        MatCardModule,
        MatTableModule,
        MatTabsModule,
        MatSidenavModule,
        MatExpansionModule,
        MatMenuModule
    ],
    exports: [
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        MatDatepickerModule,
        MatDialogModule,
        MatToolbarModule,
        MatCardModule,
        MatTableModule,
        MatTabsModule,
        MatSidenavModule,
        MatMenuModule
    ]
}) export class MaterialModules { }
