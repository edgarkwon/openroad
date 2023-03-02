import { Select } from "antd";
import { useEffect, useState } from "react";
import { blankCheck } from "../utils/common";


/** [Event handler] 직접 입력 가능한 단일 셀럭트 */
export const SingleSelectInput: React.FC<any> = ({ disabled, onChange, options, placeholder, value }): JSX.Element => {
  // 해당 컴포넌트에서 관리할 옵션
  const [selectOptions, setSelectOptions] = useState<string[]>([]);
  // 직접 입력 값 상태 변수
  const [input, setInput] = useState<string>("");

  /** [Event handler] 직접 입력으로 옵션 변경 */
  const onInputKeyDown = (e: any): void => {
    const value: any = e.target.value;
    // 입력 값 전체가 공백이 아니며, 마지막 값이 엔터(Enter) 키인지 확인
    if (e.code === "Enter" && !blankCheck(value)) {
      // 입력한 값이 옵션에 존재하지 않는 경우에만 추가
      if (!selectOptions.includes(value)) {
        setSelectOptions([...selectOptions, value]);
        onChange(value);
      }
    }
  }
  /** [Event hook] 옵션 변경 시 */
  useEffect(() => options !== undefined ? setSelectOptions(options) : undefined, [options]);
  /** [Event hook] 입력 값 초기화 */
  useEffect(() => setInput(value), [value]);

  return (
    <Select allowClear disabled={disabled} onChange={onChange} onInputKeyDown={onInputKeyDown} placeholder={placeholder} showArrow showSearch value={input}>
      {selectOptions?.map((option: string): JSX.Element => (<Select.Option key={option}>{option}</Select.Option>))}
    </Select>
  );
}