import { Injectable } from '@angular/core';

@Injectable()
export class CzLernaChangelogService {
  build(
    type: string,
    scope: string,
    subject: string,
    body?: string,
    breakingChanges?: string,
    issuesClosed?: string): string {
    return `${type}(${scope}): ${subject.toLowerCase()}${this.buildBody(body)}${this.buildBreakingChanges(breakingChanges)}${this.buildIssuesClosed(issuesClosed)}`;
  }

  private buildBody(body?: string) {
    return body
      ? `\n\n${body}`
      : '';
  }

  private buildBreakingChanges(breakingChanges?: string) {
    return breakingChanges
      ? `\n\nBREAKING CHANGE:\n${breakingChanges}`
      : '';
  }

  private buildIssuesClosed(issuesClosed?: string) {
    return issuesClosed
      ? `\n\nISSUES CLOSED: ${issuesClosed}`
      : '';
  }
}
