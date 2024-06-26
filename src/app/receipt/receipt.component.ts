import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderItem, OrderService } from '../services/data.service';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.css']
})
export class ReceiptComponent implements OnInit {
  orders: OrderItem[] = [];
  uniqueTransactionIds: string[] = [];
  ordersFromReceipt: OrderItem[] = [];
  customReceiptNumber: string | undefined; // เพิ่มตัวแปรสำหรับเก็บเลขใบเสร็จที่สุ่มขึ้นมา

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService: OrderService,
    private dialogRef: MatDialogRef<ReceiptComponent>
  ) {}

  ngOnInit(): void {
    console.log("transactionId: "+JSON.stringify(this.data));
    
    if (this.data && this.data.transactionId) {
      this.getOrderItemsByTransactionId(this.data.transactionId);
    } else {
      console.error('Transaction ID is missing or undefined');
    }
    // สร้างเลขใบเสร็จที่สุ่มขึ้นมา
    this.customReceiptNumber = 'ID' + Math.floor(Math.random() * 10000);
  }

  getOrderItemsByTransactionId(transactionId: string): void {
    this.orderService.getOrderItemsByTransactionId(transactionId).subscribe(
      (orders: OrderItem[]) => {
        this.orders = orders;
        this.ordersFromReceipt = orders; // อัปเดตค่า ordersFromReceipt ด้วยข้อมูลที่ได้
        this.updateUniqueTransactionIds(); // เรียกใช้เมธอดเพื่ออัปเดตรายการ transactionId ที่ไม่ซ้ำกัน
        
        // เรียกใช้เมธอดเพื่อเพิ่มรายการพร้อมกับเลขใบเสร็จ
        this.addOrderItemsWithReceiptNumber(this.orders);
      },
      (error: any) => {
        console.error('Error fetching order items:', error);
      }
    );
  }
  

  updateUniqueTransactionIds(): void {
    this.uniqueTransactionIds = Array.from(new Set(this.ordersFromReceipt.map(order => order.transaction_id)));
  }

  getTotalPrice(): number {
    return this.orders.reduce((total, order) => total + (order.totalPrice ?? 0), 0);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // เพิ่มฟังก์ชัน addOrderItemsWithReceiptNumber เพื่อเพิ่มรายการพร้อมเลขใบเสร็จ
  addOrderItemsWithReceiptNumber(orderItems: OrderItem[]): void {
    // สร้างเลขใบเสร็จสำหรับทุกรายการ
    orderItems.forEach(orderItem => {
      orderItem.receiptNumber = this.generateReceiptNumber(); // สร้างเลขใบเสร็จ
    });
  
    // ส่งข้อมูลรายการสั่งซื้อพร้อมเลขใบเสร็จไปยัง API หรือเซิร์ฟเวอร์เพื่อเก็บในฐานข้อมูล
    this.orderService.addOrderItems(orderItems).subscribe(
      response => {
        // สำเร็จ
        console.log('Order items added successfully:', response);
      },
      error => {
        // เกิดข้อผิดพลาด
        console.error('Error adding order items:', error);
      }
    );
  }

  // เพิ่มฟังก์ชัน generateReceiptNumber เพื่อสร้างเลขใบเสร็จ
  generateReceiptNumber(): string {
    return uuidv4(); // สร้าง UUID เป็นเลขใบเสร็จ
  }
}
