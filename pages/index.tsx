import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Button, Form, Input, InputNumber, Modal, Select, Upload, message } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
const { Dragger } = Upload;
import { InboxOutlined } from '@ant-design/icons';



export default function Home() {
  const [form] = Form.useForm();
  const [token, setToken] = useState<string>("");
  const [status, setStatus] = useState<"" | "warning" | "error">("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [item, setItem] = useState<any>(undefined);
  const [studentCard, setStudentCard] = useState<UploadFile | null> (null);
  const [messageApi, contextHolder] = message.useMessage();
  const heartLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTcuODY3IDMuNDkzbDQuMTMzIDMuNDQ0djUuMTI3bC0xMCA4LjMzMy0xMC04LjMzNHYtNS4xMjZsNC4xMzMtMy40NDQgNS44NjcgMy45MTEgNS44NjctMy45MTF6bS4xMzMtMi40OTNsLTYgNC02LTQtNiA1djdsMTIgMTAgMTItMTB2LTdsLTYtNXoiLz48L3N2Zz4=";
  const backLogo = "data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTAuOTc4IDE0Ljk5OXYzLjI1MWMwIC40MTItLjMzNS43NS0uNzUyLjc1LS4xODggMC0uMzc1LS4wNzEtLjUxOC0uMjA2LTEuNzc1LTEuNjg1LTQuOTQ1LTQuNjkyLTYuMzk2LTYuMDY5LS4yLS4xODktLjMxMi0uNDUyLS4zMTItLjcyNSAwLS4yNzQuMTEyLS41MzYuMzEyLS43MjUgMS40NTEtMS4zNzcgNC42MjEtNC4zODUgNi4zOTYtNi4wNjguMTQzLS4xMzYuMzMtLjIwNy41MTgtLjIwNy40MTcgMCAuNzUyLjMzNy43NTIuNzV2My4yNTFoOS4wMmMuNTMxIDAgMS4wMDIuNDcgMS4wMDIgMXYzLjk5OGMwIC41My0uNDcxIDEtMS4wMDIgMXptLTEuNS03LjUwNi00Ljc1MSA0LjUwNyA0Ljc1MSA0LjUwN3YtMy4wMDhoMTAuMDIydi0yLjk5OGgtMTAuMDIyeiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9zdmc+"
  const loadingLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMuNzUgMjJjMCAuOTY2LS43ODMgMS43NS0xLjc1IDEuNzVzLTEuNzUtLjc4NC0xLjc1LTEuNzUuNzgzLTEuNzUgMS43NS0xLjc1IDEuNzUuNzg0IDEuNzUgMS43NXptLTEuNzUtMjJjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAyIDItLjg5NiAyLTItLjg5Ni0yLTItMnptMTAgMTAuNzVjLjY4OSAwIDEuMjQ5LjU2MSAxLjI0OSAxLjI1IDAgLjY5LS41NiAxLjI1LTEuMjQ5IDEuMjUtLjY5IDAtMS4yNDktLjU1OS0xLjI0OS0xLjI1IDAtLjY4OS41NTktMS4yNSAxLjI0OS0xLjI1em0tMjIgMS4yNWMwIDEuMTA1Ljg5NiAyIDIgMnMyLS44OTUgMi0yYzAtMS4xMDQtLjg5Ni0yLTItMnMtMiAuODk2LTIgMnptMTktOGMuNTUxIDAgMSAuNDQ5IDEgMSAwIC41NTMtLjQ0OSAxLjAwMi0xIDEtLjU1MSAwLTEtLjQ0Ny0xLS45OTggMC0uNTUzLjQ0OS0xLjAwMiAxLTEuMDAyem0wIDEzLjVjLjgyOCAwIDEuNS42NzIgMS41IDEuNXMtLjY3MiAxLjUwMS0xLjUwMiAxLjVjLS44MjYgMC0xLjQ5OC0uNjcxLTEuNDk4LTEuNDk5IDAtLjgyOS42NzItMS41MDEgMS41LTEuNTAxem0tMTQtMTQuNWMxLjEwNCAwIDIgLjg5NiAyIDJzLS44OTYgMi0yLjAwMSAyYy0xLjEwMyAwLTEuOTk5LS44OTUtMS45OTktMnMuODk2LTIgMi0yem0wIDE0YzEuMTA0IDAgMiAuODk2IDIgMnMtLjg5NiAyLTIuMDAxIDJjLTEuMTAzIDAtMS45OTktLjg5NS0xLjk5OS0ycy44OTYtMiAyLTJ6Ii8+PC9zdmc+"
  const [logo, setLogo] = useState(heartLogo);
  const [loading, setLoading] = useState(false);
  

  const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
  const success = () => {
    messageApi.open({
      type: 'success',
      content: '프로필 등록이 정상적으로 접수되었습니다.',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: '프로필 등록 과정에서 문제가 발생하였습니다.',
    });
  };


  const onTokenType = async (e: any) => {
    if(e.target.value.length === 66){
      setStatus("");
      setLoading(true);
      setLogo(loadingLogo);
      const res = await fetch(`https://dfe2pgf5wv2spiwuwr2osicqgy0ekucs.lambda-url.ap-northeast-2.on.aws/?uid=${e.target.value}`);
      console.log(res);
      if (res.status === 200){
        const fetchedItem = await res.json();
        console.log(fetchedItem);
        setItem(fetchedItem);
        setLogo(backLogo)
        setToken(e.target.value);
        form.setFieldsValue({...fetchedItem, contactStyle: fetchedItem?.contactStyle ? fetchedItem?.contactStyle.split(",") : [], pet: fetchedItem?.pet ? fetchedItem?.pet.split(",") : []});
        setLoading(false);
      }
      else {
        setItem({});
        setToken(e.target.value);
        setLogo(backLogo);
        setLoading(false);
      }
    } else{
      setStatus("warning");
      setLoading(false);
    }
  }

  const onUpload: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleCancel = () => setPreviewOpen(false);

  const handleSelectChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  const onBackward = () => {
    setToken("");
    setLogo(heartLogo);
    setItem(undefined);
    form.resetFields();
  }
  const onFinish = async(values: any) => {
    console.log("onFinish start")
    form.validateFields().then(
      async (values) => {
        console.log("validate");
        var studentCardUrl;
        // student card upload and get the url
        if (studentCard?.type) {
          const studentCardPresigned = await(await fetch(`https://msijrjatrcvc3aorpblgxnsbtq0lxlmn.lambda-url.ap-northeast-2.on.aws/?uid=${token}&filename=studentCard&type=${studentCard.type}`)).json();
          const studentCardResult = await fetch(studentCardPresigned.uploadURL, {
            method: 'PUT',
            body: studentCard
          })
          studentCardUrl = studentCardResult.url.split('?')[0];
          console.log("studentCardUrl", studentCardUrl);
        } else {
          studentCardUrl = values.studentCard;
          console.log("이미 있던거 쓴다", studentCardUrl);
        }
        
        // new images upload and get the url
        console.log(values.images.fileList);


        const imageList = values.images.fileList;
        var i;
        var imageUrlList = []
        for (i=0; i < imageList.length ; i++){
          if(imageList[i].url){
            imageUrlList.push(imageList[i].url);
          } else{
            console.log("just element", imageList[i]);
            console.log("file", imageList[i].originFileObj);
            var imagePresigned = await(await fetch(`https://msijrjatrcvc3aorpblgxnsbtq0lxlmn.lambda-url.ap-northeast-2.on.aws/?uid=${token}&filename=${i}&type=${studentCard.type}`)).json();
            var imageResult = await fetch(imagePresigned.uploadURL, {
              method: 'PUT',
              body: imageList[i].originFileObj
            })
            imageUrlList.push(imageResult.url.split('?')[0]);
          }
        }
        const res: any = await fetch(`https://gfmkuryu5i36woftia2y74zfsa0exqqg.lambda-url.ap-northeast-2.on.aws`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...values, pet: values.pet.join(','), contactStyle: values.contactStyle.join(','), studentCard: studentCardUrl, images: imageUrlList }),
        })
        // 응답 처리
        if (res.statusText == "OK") {
          success();
        } else {
          error();
        }
      }).catch(
      (errorInfo)=>{console.log(errorInfo); }
    )
  }

  const validateMessages = {
    required: "${name} 기입은 필수 사항입니다.",
  };

  const validateImages = (imagesInput, value) => {
    if (value?.fileList && value?.fileList.length > 0 || value.length > 0) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error(imagesInput.message));
    }
  };

  const validateStudentCard = (studentCardInput, value) => {
    if (value?.fileList && value?.fileList.length > 0 || value.length > 0) {
      return Promise.resolve();
    } else {
      return Promise.reject(new Error(studentCardInput.message));
    }
  };

  useEffect(()=>{console.log(item)}, [item]);

  return (
    <>
      {contextHolder}
      <div className = {styles.container}>
      <main className={styles.main}>
        <div className={styles.thirteen}>
            <Image
              src={logo}
              alt="13"
              width={40}
              height={31}
              priority
              onClick={onBackward}
            />
          </div>
      {!loading &&
        <Form className={styles.form} form={form} validateMessages={validateMessages}>
        <Form.Item style={{width: "90%", marginBottom: "5px", display: item === undefined ? "auto" : "none"}} name="uid"><Input style = {{width: "100%", textAlign: "center"}} status={status} onChange={e => onTokenType(e)} placeholder="시작을 위해 토큰을 붙여넣으세요 *"/></Form.Item>
          {token !== "" ? 
          <>
            <div style={{marginTop: "15px", marginLeft: "8px"}}>
              <Form.Item name="images" rules={[{
                validator: validateImages,
                message: "최소 한 장 이상의 사진을 등록해주세요.",
              }]}>
                <Upload
                accept="image/*"
                style={{width: "100%"}}
                listType="picture-card"
                defaultFileList={item?.images ? item.images.map((url, index) => {return {uid: index+1, url: url, name: "name"}}) : []}
                onChange={onUpload}
                onPreview={handlePreview}
                > 
                  {fileList.length < 3 && <span style={{color: "white"}}> + 프로필 사진 <br/>(최대 3개)</span>}
                </Upload>
              </Form.Item>
              <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                <img alt="preview" style={{ width: '100%' }} src={previewImage} />
              </Modal>
            </div>
            <Form.Item style={{width: "90%", marginBottom: "15px"}} name="studentCard" rules={[{
                validator: validateStudentCard,
                message: "학생증 사진을 등록해주세요.",
              }]}>
              <Dragger listType='picture' accept="image/*" maxCount={1} defaultFileList={item?.studentCard ? [{uid: "0", name: "studentCard", url: item.studentCard}] : []} beforeUpload={(file: UploadFile) => {setStudentCard(file);}}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text" style={{color: "white"}}>학생증 업로드</p>
                <p className="ant-upload-hint" style={{color: "white", marginLeft: "5px", marginRight: "5px"}}>
                  학생 신원 확인 용도로만 활용됩니다. 타인의 학생증 등 부적합한 파일 업로드 시 영구 차단될 수 있습니다.
                </p>
              </Dragger>
            </Form.Item>

            <Form.Item style={{width: "90%", marginBottom: "5px", marginTop: "25px"}} name="school" rules={[{ required: true }]}>
              <Select
                placeholder = "학교 *"
                style={{ width: "100%" }}
                onChange={handleSelectChange}
                options={[
                  { value: '카이스트', label: '카이스트' },
                  { value: '충남대', label: '충남대' },
                ]}
              />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="sex" rules={[{ required: true }]}>
              <Select
                placeholder = "성별 *"
                style={{ width: "100%" }}
                onChange={handleSelectChange}
                options={[
                  { value: '남자', label: '남자' },
                  { value: '여자', label: '여자' },
                ]}
              />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="nickname" rules={[{ required: true }]}>
              <Input style = {{width: "100%"}} placeholder="닉네임 *"/>
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="kakaoId" rules={[{ required: true }]}>
              <Input style = {{width: "100%"}} placeholder="카카오 ID *"/>
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="age" rules={[{ required: true }]}>
              <InputNumber min={19} max={100} placeholder="나이 *" style = {{width: "100%"}}/>
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="education">
              <Select allowClear
                placeholder = "학력"
                style={{ width: "100%"}}
                onChange={handleSelectChange}
                options={[
                  { value: '학부 재학중', label: '학부 재학중' },
                  { value: '석사 재학중', label: '석사 재학중' },
                  { value: '박사 재학중', label: '박사 재학중' },
                  { value: '휴학', label: '휴학' },
                  { value: '교수', label: '교수' },
                ]}
              />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="mbti">
              <Input style = {{width: "100%"}} placeholder="MBTI"/>
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="height">
              <InputNumber min={100} max={250} placeholder="키" style = {{width: "100%"}}/>
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="smoke">
              <Select allowClear
                placeholder = "흡연량"
                style={{ width: "100" }}
                onChange={handleSelectChange}
                options={[
                  { value: '다른 흡연자가 있을 때만', label: '다른 흡연자가 있을 때만' },
                  { value: '술 마실 때만', label: '술 마실 때만' },
                  { value: '비흡연', label: '비흡연' },
                  { value: '흡연', label: '흡연' },
                  { value: '금연 중', label: '금연 중' }
                ]}
              />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="drink">
              <Select allowClear
                placeholder = "음주"
                style={{ width: "100%" }}
                onChange={handleSelectChange}
                options={[
                  { value: '아예 안 마심', label: '아예 안 마심' },
                  { value: '가끔 마심', label: '가끔 마심' },
                  { value: '자주 마심', label: '자주 마심' },
                  { value: '매일 마심', label: '매일 마심' },
                  { value: '혼술할 정도로 좋아하는 편', label: '혼술할 정도로 좋아하는 편' },
                  { value: '친구들 만날 때만 마시는 편', label: '친구들 만날 때만 마시는 편' },
                  { value: '현재 금주 중', label: '현재 금주 중' }
                ]}
              />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="relation">
              <Select allowClear
                placeholder = "내가 찾는 관계"
                style={{ width: "100%" }}
                onChange={handleSelectChange}
                options={[
                  { value: '진지한 연애', label: '진지한 연애' },
                  { value: '진지한 연애를 찾지만 캐주얼해도 괜찮음', label: '진지한 연애를 찾지만 캐주얼해도 괜찮음' },
                  { value: '캐주얼한 연애를 찾지만 진지해도 괜찮음', label: '캐주얼한 연애를 찾지만 진지해도 괜찮음' },
                  { value: '캐주얼하게 만날 친구', label: '캐주얼하게 만날 친구' },
                  { value: '새로운 동네 친구', label: '새로운 동네 친구' },
                  { value: '아직 모르겠음', label: '아직 모르겠음' },
                ]}
              />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="contactStyle">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="연락 스타일"
                onChange={handleSelectChange}
                options={[{ value: '카톡 자주 하는 편', label: '카톡 자주 하는 편' },
                { value: '전화 선호함', label: '전화 선호함' },
                { value: '영상통화 선호함', label: '영상통화 선호함' },
                { value: '카톡 별로 안 하는 편', label: '카톡 별로 안 하는 편' },
                { value: '직접 만나는 걸 선호함', label: '직접 만나는 걸 선호함' },]}
              />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="pet">
              <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="반려 동물"
                onChange={handleSelectChange}
                options={[{ value: '강아지', label: '강아지' },
                { value: '고양이', label: '고양이' },
                { value: '물고기', label: '물고기' },
                { value: '조류', label: '조류' },
                { value: '키우고 싶음', label: '키우고 싶음' },
                { value: '키움 당하고 싶음', label: '키움 당하고 싶음' },]}
              />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "40px"}} name="pr">
              <Input style = {{width: "100%"}} placeholder="한 줄 소개"/>
            </Form.Item>
            <Button type = "primary" htmlType="submit" style = {{width: "90%", marginBottom: "100px"}} onClick={onFinish}>프로필 등록하기</Button></>
          : <></>}
        </Form>}
      </main>
      </div>
    </>
  )
}
