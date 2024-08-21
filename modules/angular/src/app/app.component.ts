import { AsyncPipe } from "@angular/common";
import { Component, ExperimentalPendingTasks, inject } from "@angular/core";
import { finalize, from } from "rxjs";
import { testData } from "testdata";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if(data$ | async; as data) {
    <table>
      <tbody>
        @for(entry of data; track $index) {
        <tr>
          <td>{{ entry.id }}</td>
          <td>{{ entry.name }}</td>
        </tr>
        }
      </tbody>
    </table>
    }
  `,
})
export class AppComponent {

  // This is a zoneless app, we need to keep the app unstable until the data is loaded.
  pendingTasks = inject(ExperimentalPendingTasks);
  finishTask: VoidFunction | undefined;
  
  constructor() {
    this.finishTask = this.pendingTasks.add();
  }

  data$ = from(testData()).pipe(finalize(() => this.finishTask?.()));
}
