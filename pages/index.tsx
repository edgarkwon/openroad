import styles from '../styles/Home.module.css'
import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Button, Form, Input, InputNumber, Modal, Select, Upload, message, TreeSelect } from 'antd';
import type { RcFile, UploadProps } from 'antd/es/upload';
import type { UploadFile } from 'antd/es/upload/interface';
const { Dragger } = Upload;
import { InboxOutlined } from '@ant-design/icons';
import { schoolsData } from '../data/schools';
import { useRouter } from 'next/router';
const { SHOW_CHILD } = TreeSelect;



export default function Home() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [token, setToken] = useState<string>("");
  const [isCreate, setIsCreate] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [item, setItem] = useState<any>(undefined);
  const [studentCard, setStudentCard] = useState<UploadFile | null> (null);
  const [messageApi, contextHolder] = message.useMessage();
  const heartLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTguNTg2IDEwLjA4MWMtMS40MzkgMC0xLjM1IDIuODAyLTIuMDI5IDQuMDcxLS4xMTQuMjExLS40MjUuMTg0LS41LS4wNDQtLjc3MS0yLjM2NC0uNDE5LTguMTA4LTIuNTEtOC4xMDgtMi4xODkgMC0xLjY0OCA3LjQzMy0yLjUgMTAuNDYyLS4wNjMuMjMtLjM4MS4yNS0uNDc0LjAyOC0uOS0yLjE2MS0uNzk5LTYuODc1LTIuNTAyLTYuODc1LTEuNzYyIDAtMS42MTIgMy45NDktMi4zMDIgNS41NC0uMDkxLjIxMy0uMzkyLjIyLS40OTMuMDEtLjUwMy0xLjA0OS0uNjY0LTMuMTY1LTIuNTY0LTMuMTY1aC0yLjIxM2MtLjI3NSAwLS40OTkuMjI0LS40OTkuNDk5cy4yMjQuNTAxLjQ5OS41MDFoMi4yMTNjMS41NzIgMCAxLjAzOCAzLjQ4NCAyLjg1NCAzLjQ4NCAxLjY4NCAwIDEuNTAyLTMuNzkgMi4yMjMtNS40Ny4wODgtLjIwOC4zODItLjIwMi40NjYuMDA2LjgwNSAyLjA0Ny43OSA2Ljk4IDIuNjQxIDYuOTggMi4wNzcgMCAxLjMzNy03Ljg1NiAyLjQ0My0xMC42MjEuMDgzLS4yMTEuMzg0LS4yMjIuNDc5LS4wMTIgMS4wMjkgMi4yNS40ODcgOC4xMjYgMi4zNDQgOC4xMjYgMS42MzkgMCAxLjczNy0yLjcwNiAyLjIzLTQuMDM4LjA4MS0uMjEyLjM3My0uMjI3LjQ3NC0uMDI3LjUxNiAxLjAwMS44NDYgMi41NzIgMi40IDIuNTcyaDIuMjM1Yy4yNzUgMCAuNDk5LS4yMjQuNDk5LS40OTkgMC0uMjc2LS4yMjQtLjUtLjQ5OS0uNWgtMi4yMzVjLTEuMzIzIDAtMS4xMTctMi45Mi0yLjY4LTIuOTJ6Ii8+PC9zdmc+";
  const loadingLogo = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTMuNzUgMjJjMCAuOTY2LS43ODMgMS43NS0xLjc1IDEuNzVzLTEuNzUtLjc4NC0xLjc1LTEuNzUuNzgzLTEuNzUgMS43NS0xLjc1IDEuNzUuNzg0IDEuNzUgMS43NXptLTEuNzUtMjJjLTEuMTA0IDAtMiAuODk2LTIgMnMuODk2IDIgMiAyIDItLjg5NiAyLTItLjg5Ni0yLTItMnptMTAgMTAuNzVjLjY4OSAwIDEuMjQ5LjU2MSAxLjI0OSAxLjI1IDAgLjY5LS41NiAxLjI1LTEuMjQ5IDEuMjUtLjY5IDAtMS4yNDktLjU1OS0xLjI0OS0xLjI1IDAtLjY4OS41NTktMS4yNSAxLjI0OS0xLjI1em0tMjIgMS4yNWMwIDEuMTA1Ljg5NiAyIDIgMnMyLS44OTUgMi0yYzAtMS4xMDQtLjg5Ni0yLTItMnMtMiAuODk2LTIgMnptMTktOGMuNTUxIDAgMSAuNDQ5IDEgMSAwIC41NTMtLjQ0OSAxLjAwMi0xIDEtLjU1MSAwLTEtLjQ0Ny0xLS45OTggMC0uNTUzLjQ0OS0xLjAwMiAxLTEuMDAyem0wIDEzLjVjLjgyOCAwIDEuNS42NzIgMS41IDEuNXMtLjY3MiAxLjUwMS0xLjUwMiAxLjVjLS44MjYgMC0xLjQ5OC0uNjcxLTEuNDk4LTEuNDk5IDAtLjgyOS42NzItMS41MDEgMS41LTEuNTAxem0tMTQtMTQuNWMxLjEwNCAwIDIgLjg5NiAyIDJzLS44OTYgMi0yLjAwMSAyYy0xLjEwMyAwLTEuOTk5LS44OTUtMS45OTktMnMuODk2LTIgMi0yem0wIDE0YzEuMTA0IDAgMiAuODk2IDIgMnMtLjg5NiAyLTIuMDAxIDJjLTEuMTAzIDAtMS45OTktLjg5NS0xLjk5OS0ycy44OTYtMiAyLTJ6Ii8+PC9zdmc+"
  const errorLogo = "data:image/svg+xml;base64,PHN2ZyBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTIuMDAyIDIxLjUzNGM1LjUxOCAwIDkuOTk4LTQuNDggOS45OTgtOS45OThzLTQuNDgtOS45OTctOS45OTgtOS45OTdjLTUuNTE3IDAtOS45OTcgNC40NzktOS45OTcgOS45OTdzNC40OCA5Ljk5OCA5Ljk5NyA5Ljk5OHptMC0xLjVjLTQuNjkgMC04LjQ5Ny0zLjgwOC04LjQ5Ny04LjQ5OHMzLjgwNy04LjQ5NyA4LjQ5Ny04LjQ5NyA4LjQ5OCAzLjgwNyA4LjQ5OCA4LjQ5Ny0zLjgwOCA4LjQ5OC04LjQ5OCA4LjQ5OHptMC02LjVjLS40MTQgMC0uNzUtLjMzNi0uNzUtLjc1di01LjVjMC0uNDE0LjMzNi0uNzUuNzUtLjc1cy43NS4zMzYuNzUuNzV2NS41YzAgLjQxNC0uMzM2Ljc1LS43NS43NXptLS4wMDIgM2MuNTUyIDAgMS0uNDQ4IDEtMXMtLjQ0OC0xLTEtMS0xIC40NDgtMSAxIC40NDggMSAxIDF6IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48L3N2Zz4=";
  const [logo, setLogo] = useState(heartLogo);
  const [loading, setLoading] = useState(false);
  const [treeValue, setTreeValue] = useState(['0-0-0']);
  const [school, setSchool] = useState<string>();

  

  const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
  const createSuccess = () => {
    messageApi.open({
      type: 'success',
      content: '프로필이 만들어졌어요. 카카오 챗봇에서 운명을 찾을 시간이네요:)',
    });
  };

  const updateSuccess = () => {
    messageApi.open({
      type: 'success',
      content: '프로필 수정이 완료되었어요. 오늘도 멋진 하루 보내세요:)',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: '프로필 등록 과정에서 문제가 발생하였습니다.',
    });
  };

  const badAccess = () => {
    messageApi.open({
      type: 'error',
      content: '잘못된 경로입니다.',
    });
  };

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


  const onFinish = useCallback(async(values: any) => {
    console.log("onFinish start")
    form.validateFields().then(
      async (values) => {
        console.log("validate");
        var studentCardUrl;
        console.log(studentCard);
        // student card upload and get the url
        if (studentCard?.type) {
          const studentCardPresigned = await(await fetch(`https://msijrjatrcvc3aorpblgxnsbtq0lxlmn.lambda-url.ap-northeast-2.on.aws/?uid=${router.query.uid}&filename=studentCard&type=${studentCard.type}`)).json();
          const studentCardResult = await fetch(studentCardPresigned.uploadURL, {
            method: 'PUT',
            body: studentCard
          })
          console.log(studentCardResult.url);
          studentCardUrl = studentCardResult.url.split('?')[0];
          console.log("studentCardUrl", studentCardUrl);
        } else {
          studentCardUrl = values.studentCard;
          console.log("이미 있던거 쓴다", studentCardUrl);
        }
        
        // new images upload and get the url

        var imageList = values.images.fileList;
        if(imageList === undefined){imageList = values.images}
        var i;
        var imageUrlList = []
        for (i=0; i < imageList.length ; i++){
          if(typeof imageList[i] === "string"){
            imageUrlList.push(imageList[i]);
          }
          else if(imageList[i].url){
            imageUrlList.push(imageList[i].url);
          } else{
            console.log("just element", imageList[i]);
            console.log("file", imageList[i].originFileObj);
            var imagePresigned = await(await fetch(`https://msijrjatrcvc3aorpblgxnsbtq0lxlmn.lambda-url.ap-northeast-2.on.aws/?uid=${router.query.uid}&filename=${i}&type=${studentCard.type}`)).json();
            var imageResult = await fetch(imagePresigned.uploadURL, {
              method: 'PUT',
              body: imageList[i].originFileObj
            })
            imageUrlList.push(imageResult.url.split('?')[0]);
          }
        }
        console.log(imageUrlList);
        var res;
        if (isCreate){
          console.log("creating")
          console.log(values);
          res = await fetch(`https://gfmkuryu5i36woftia2y74zfsa0exqqg.lambda-url.ap-northeast-2.on.aws`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...values, uid: router.query.uid, smoke: values?.smoke ? values.smoke : "", drink: typeof(values.drink) === "string" ? values.drink : "", relation: typeof(values.relation) === "string" ? values.relation : "", education: typeof(values.education) === "string" ? values.education : "",targetSchool: values.targetSchool.join(','), pet: values?.pet ? values.pet.join(',') : "", contactStyle: values?.contactStyle ? values.contactStyle.join(',') : "", studentCard: studentCardUrl, images: imageUrlList}),
          })
          if (res.statusText == "OK") {
            createSuccess();
          } else {
            error();
          }
          setIsCreate(false);
        } else{
          console.log("updating")
          res = await fetch(`https://gfmkuryu5i36woftia2y74zfsa0exqqg.lambda-url.ap-northeast-2.on.aws`, {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...values, uid: router.query.uid, smoke: values?.smoke ? values.smoke : "", drink: typeof(values.drink) === "string" ? values.drink : "", relation: typeof(values.relation) === "string" ? values.relation : "", education: typeof(values.education) === "string" ? values.education : "",targetSchool: values.targetSchool.join(','), pet: values?.pet ? values.pet.join(',') : "", contactStyle: values?.contactStyle ? values.contactStyle.join(',') : "", studentCard: studentCardUrl, images: imageUrlList}),
          // body: JSON.stringify({...values, uid: router.query.uid, targetSchool: values.targetSchool.join(','), pet: values.pet.join(','), contactStyle: values.contactStyle.join(','), studentCard: studentCardUrl, images: imageUrlList}),
          })
          if (res.statusText == "OK") {
            updateSuccess();
          } else {
            error();
          }
        }
        // 응답 처리
       
      }).catch(
      (errorInfo)=>{console.log(errorInfo); }
    )
  }, [router, form, studentCard, isCreate]);

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

  const onTargetSchoolChange = (newValue: string[]) => {
    console.log('onChange ', treeValue);
    setTreeValue(newValue);
  };
  
  const onMySchoolChange = (newValue: string, newLabel: string) => {
    if (newValue === newLabel[0]){
      console.log(newValue);
      console.log(newLabel[0]);
      setSchool(newValue);
    }
  };

  const targetSchoolProps = {
    treeData: schoolsData,
    value: treeValue,
    treeCheckable: true,
    onChange: onTargetSchoolChange,
    showCheckedStrategy: SHOW_CHILD,
    placeholder: '상대의 학교 (선택한 학교만 서로 프로필이 노출됨)',
    style: {
      width: '100%',
    },
    allowClear: true
  };

  const mySchoolProps = {
    treeData: schoolsData,
    value: school,
    onChange: onMySchoolChange,
    placeholder: '내 학교',
    style: {
      width: '100%',
    },
    showSearch: true,
    allowClear: true
  };
  


  useEffect(()=> {
    const onCheckProfile = async() => {
      if(router.query.uid){
        setToken(router.query.uid);
        setLoading(true);
        setLogo(loadingLogo);
        console.log("test")
        const res = await fetch(`https://dfe2pgf5wv2spiwuwr2osicqgy0ekucs.lambda-url.ap-northeast-2.on.aws/?uid=${router.query.uid}`);
        if (res.status === 200){
          const fetchedItem = await res.json();
          setIsCreate(false);
          setItem(fetchedItem);
          form.setFieldsValue({...fetchedItem, contactStyle: fetchedItem?.contactStyle ? fetchedItem?.contactStyle.split(",") : [], drink: fetchedItem?.drink ? fetchedItem?.drink : [], relation: fetchedItem?.relation ? fetchedItem?.relation : [], smoke: fetchedItem?.smoke ? fetchedItem?.smoke : [],  education: fetchedItem?.education ? fetchedItem?.education : [], targetSchool: fetchedItem?.targetSchool ? fetchedItem?.targetSchool.split(",") : [], pet: fetchedItem?.pet ? fetchedItem?.pet.split(",") : []});
        }
        else {
          setIsCreate(true);
          setItem({});
        }
        setLogo(heartLogo)
        setLoading(false);
      }
      else {
        setLogo(errorLogo);
      }
    }  
    console.log(fileList);
    onCheckProfile()
  } , [router, form])

  return (
    <>
      {contextHolder}
      <div className = {styles.container}>
      <main className={styles.main}>
        <div className={styles.thirteen}>
            <Image
              src={logo}
              alt="13"
              width={60}
              height={46}
              priority
            />
        </div>
        {logo === errorLogo && <p>잘못된 경로입니다.</p>}
      {!loading &&
        <Form className={styles.form} form={form} validateMessages={validateMessages}>
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
                  {item?.images?.length < 3 && <span style={{color: "white"}}> + 프로필 사진 <br/>(최대 3개)</span>}
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
              <TreeSelect {...mySchoolProps} />
            </Form.Item>
            <Form.Item style={{width: "90%", marginBottom: "5px"}} name="targetSchool" rules={[{ required: true }]}>
              <TreeSelect {...targetSchoolProps} />
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
            <Button type = "primary" htmlType="submit" style = {{width: "90%", marginBottom: "100px"}} onClick={onFinish}>{isCreate ? "프로필 생성하기" : "프로필 수정하기"}</Button></>
          : <></>}
        </Form>}
      </main>
      </div>
    </>
  )
}
