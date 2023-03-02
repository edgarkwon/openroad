/**
 * [Function] 문자열에 대한 공백 확인 함수
 * @param value 입력값
 * @returns 확인 결과
 */
export const blankCheck = (value: string | undefined): boolean => {
    try {
      return value ? value.replace(/^\s+|\s$/g, "") === "" : true;
    } catch (err: any) {
      return true;
    }
  }